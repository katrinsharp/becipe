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

case class SignupDetails(firstName: String, lastName: String, email: String)

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
	
	//default is local
	val useLocalStorage = Play.application.configuration.getString("save.to").getOrElse("local").equalsIgnoreCase("local")
	
	def index = Action { implicit request =>
		Logger.info("mongodb.uri: "+Play.current.configuration.getString("mongodb.uri").getOrElse(""))
		Ok(views.html.index())
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
			  Logger.debug(formWithErrors.toString)
			  BadRequest 
			},
			value => {
			  Logger.debug(value.toString)
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
				  e => if(e.ok) {
					  		val confirmationLink = "http://"+request.host+"/signup/confirm/"+token
					  		Application.emailService.send(new EmailMessage(
			  										subject = "User Registration Confirmation",
			  										recipient = value.email,
			  										from = "info@becipe.com",
			  										smtpConfig = Application.defaultSmtpConfig,
			  										html = Some(s"""Hi, please click following link to confirm your registration: <a href="$confirmationLink">confirm</a>""")
					  		))
					  		Ok("")
				    	} else BadRequest(e.toString)  
			  	}
			  }
			})
	}
	
	def signupConfirm(token: String) = Action { request =>
	  
	  Async {
			val qb = QueryBuilder().query(Json.obj("token" -> token))
			Application.signupsCollection.find[JsValue](qb).toList.map  { l =>
				Ok(Json.toJson(l.head))
			}
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