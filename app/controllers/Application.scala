package controllers

import play.api._
import play.api.mvc._
import reactivemongo.api._
import reactivemongo.bson._
import reactivemongo.bson.handlers.DefaultBSONHandlers._
import play.modules.reactivemongo._
import play.modules.reactivemongo.PlayBsonImplicits._
import play.api.libs.json._
import play.api.Play.current
import models.Recipe
import models.Signup
import play.api.data.Form
import play.api.data.Forms._
import play.api.data.validation.Constraints._
import org.joda.time.DateTime
import services.EmailService
import services.SmtpConfig
import java.util.UUID
import services.EmailMessage
import scala.concurrent.Future
import org.mindrot.jbcrypt.BCrypt
import reactivemongo.core.commands.FindAndModify
import reactivemongo.core.commands.Update
import play.api.libs.ws.WS
import utils.Mandrill

case class SignupDetails(firstName: String, lastName: String, email: String)
case class Email(email: String)
case class Password(password: String)
case class Login(email: String, password: String)

object Application extends Controller with MongoController{

	val db = ReactiveMongoPlugin.db
	lazy val recipeCollection = db("recipes")
	lazy val signupsCollection = db("signups")
	
	//email service
	lazy val defaultSmtpConfig = new SmtpConfig(host = Play.application.configuration.getString("smtp.host").getOrElse(""),
	    										port = Play.application.configuration.getString("smtp.port").getOrElse("0") toInt,
	    										user = Play.application.configuration.getString("smtp.username").getOrElse(""),
	    										password = Play.application.configuration.getString("smtp.password").getOrElse("")
		)
	lazy val emailService = EmailService
	
	lazy val mandrillApiKey = Play.application.configuration.getString("mandrill.apikey").getOrElse("")
	
	//default is local
	val useLocalStorage = Play.application.configuration.getString("save.to").getOrElse("local").equalsIgnoreCase("local")
	
	def index = Action { implicit request =>
		Logger.info("mongodb.uri: "+Play.current.configuration.getString("mongodb.uri").getOrElse(""))
		Ok(views.html.index())
	}
	
	private def getSignupByEmail(email: String) = {
			val qb = QueryBuilder().query(Json.obj("email" -> email))
			Application.signupsCollection.find[JsValue](qb).toList.map  { l =>
			  	//l.headOption match {
			  	 // case Some(v) => Json.toJson(v)
			  	 // case _ => throw new Exception("Error authentication")
			  	//}
				//Json.toJson(l.head)
			  l.head
			  
			}
	}
	
	val loginForm: Form[Login] = Form(
		mapping(
			"em" -> nonEmptyText,
			"ps" -> nonEmptyText
		)(Login.apply)(Login.unapply))
	
	def login = Action { implicit request =>
	     loginForm.bindFromRequest.fold(
			formWithErrors => {
			  BadRequest(formWithErrors.errorsAsJson) 
			},
			value => {
			  Async {
				  getSignupByEmail(value.email).map(f => {
					  val pass = (f.\("pass").asOpt[String])
					  if(pass != None && BCrypt.checkpw(value.password, pass.get))
					    Ok(Json.obj("token" -> "kuku", "fn" -> f.\("firstName").as[String])).withSession(("token" -> "kuku"))
					  else 
					    Unauthorized(Json.obj("em" -> "Invalid email or password"))
				  }).recover{
				  		case e => Unauthorized(Json.obj("em" -> "Invalid email or password"))
				  }
			  }
			})
	}
	
	def logout = Action { implicit request =>
	  Ok.withNewSession
	}
	
	private def  setNewTokenForSignupByEmail(email: String, token: String) = {
		
		val selector = QueryBuilder().query(Json.obj("email" -> email)).makeQueryDocument
		val q = Json.obj("$set" -> Json.obj("token" -> token))
	  
		val modifier = QueryBuilder().query(q).makeQueryDocument	
		
		db.command(FindAndModify(Application.signupsCollection.name, selector, Update(modifier, true)))
	}
	
	val forgotPasswordForm: Form[Email] = Form(
		mapping(
			"em" -> nonEmptyText
		)(Email.apply)(Email.unapply))
	
	
	def forgotPassword = Action { implicit request =>
	  forgotPasswordForm.bindFromRequest.fold(
			formWithErrors => {
			  BadRequest(formWithErrors.errorsAsJson) 
			},
			value => {
			  Async {
				  val token = UUID.randomUUID().toString()	
				  setNewTokenForSignupByEmail(value.email, token).map(
				      f => {
				    	  f match {
				    	    case Some(signup) => {
				    	    	val firstName = signup.get("firstName").get.asInstanceOf[BSONString].value
				    	    	val confirmationLink = "http://"+request.host+"/signup/confirm/"+token
				    	    	Application.emailService.send(new EmailMessage(
			  										subject = "User Registration Confirmation",
			  										recipient = value.email,
			  										from = "info@becipe.com",
			  										smtpConfig = Application.defaultSmtpConfig,
			  										html = Some(s"""Hi $firstName, please click following link to reset your password: <a href="$confirmationLink">reset</a>""")
				    	    	))
				    	    	Ok("")
				    	    }
				    	    case None => BadRequest(Json.obj("em" -> "Doesn't exist"))
				    	  }
				      })
				}
			})
	}
	
	val signupForm: Form[SignupDetails] = Form(
		mapping(
			"fn" -> nonEmptyText,
			"ln" -> nonEmptyText,
			"em" -> email
		)(SignupDetails.apply)(SignupDetails.unapply))
	
	def newSignup = Action {  implicit request =>
	  signupForm.bindFromRequest.fold(
			formWithErrors => {
			  BadRequest(formWithErrors.errorsAsJson) 
			},
			value => {
			  val token = UUID.randomUUID().toString()
			  val modifier = QueryBuilder().query(Json.obj(
						"firstName" -> value.firstName,
						"lastName" -> value.lastName,
						"email" -> value.email,
						"response" -> "0",
						"token" -> token,
						"created" -> DateTime.now())).makeQueryDocument 
			  Async {
			  	Application.signupsCollection.insert(modifier).map {
				  e =>
				  		/*val confirmationLink = "http://"+request.host+"/signup/confirm/"+token
				  		val firstName = value.firstName
				  		Application.emailService.send(new EmailMessage(
		  										subject = "User Registration Confirmation",
		  										recipient = value.email,
		  										from = "info@becipe.com",
		  										smtpConfig = Application.defaultSmtpConfig,
		  										html = Some(s"""Hi $firstName, please click following link to confirm your registration: <a href="$confirmationLink">confirm</a>""")
				  		))*/
				    	WS.url("https://mandrillapp.com/api/1.0//messages/send-template.json").post(
				    	    Mandrill.createRegistrationConfirmRequest(value.email, "http://"+request.host, token)).map(f => Logger.debug(f.json.toString))
				  		Ok("")
			  	}.recover {
			  	  case e =>
			  	    val isDuplicate = e.getMessage().indexOf("E11000 duplicate key error") != -1
			  	    if(isDuplicate) 
			  	      BadRequest(Json.obj("em" -> "Already exists"))
			  	    else 
			  	      BadRequest(Json.obj("error" -> e.getMessage()))
			  	}
			  }
			})
	}
	
	private def getSignupByToken(token: String) = {
			val qb = QueryBuilder().query(Json.obj("token" -> token))
			Application.signupsCollection.find[JsValue](qb).toList.map  { l =>
				l.head
			}
	}
	private def updateSignupByToken(token: String, password: String) = {
	 	  
	  val selector = QueryBuilder().query(Json.obj("token" -> token)).makeQueryDocument
	  
	  val q = Json.obj("$set" -> Json.obj("pass" -> BCrypt.hashpw(password, BCrypt.gensalt()), "token" -> "0"))
	  
	  val modifier = QueryBuilder().query(q).makeQueryDocument
	  
	  db.command(FindAndModify(Application.signupsCollection.name, selector, Update(modifier, true)))
	  
	}
	
	val savePasswordForm: Form[Password] = Form(
		mapping(
			"ps" -> nonEmptyText
		)(Password.apply)(Password.unapply))
	
	def updateSignup(token: String) = Action {  implicit request =>
	  
	  savePasswordForm.bindFromRequest.fold(
			formWithErrors => {
			  BadRequest(formWithErrors.errorsAsJson) 
			},
			value => {
			  Async {
				updateSignupByToken(token, value.password).map{
				  f => 
				    f match {
				      case Some(signup) => 
				      		Ok(Json.obj("token" -> "kuku", "fn" -> signup.get("firstName").get.asInstanceOf[BSONString].value)).withSession("token" -> "kuku")
				      case None => BadRequest(Json.obj("ps" -> "Unknown Error"))
				    }
				 }
			  }
			  
			})
	}
	
	def redirectToSignupConfirm(token: String) = Action { request =>
		Redirect("/#user/confirm/"+token)
	}
	
	def getSignupAsJson(token: String) = Action { request =>
	  
	  Async {
		  getSignupByToken(token).map(f => Ok(f))
		}
	}
	
	def javascriptRoutes = Action {  implicit request =>
		import routes.javascript._
    Ok(
      Routes.javascriptRouter("jsRoutes")(
      )
    ).as("text/javascript")
  }
}