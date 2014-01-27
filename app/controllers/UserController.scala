package controllers

import utils.{Mandrill, UniqueCode}
import play.api._
import play.api.mvc._
import reactivemongo.api._
import reactivemongo.bson._
import play.modules.reactivemongo._
import play.api.libs.json._
import play.api.Play.current
import models.Recipe
import models.User
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
import auth.Authenticated
import models.SessionObj

case class SignupDetails(firstName: String, lastName: String, email: String)
case class Email(email: String)
case class Password(password: String)
case class Login(email: String, password: String)

object UserController extends Controller with MongoController{
  
	def getUserById(userid: String) = {
			val qb = Json.obj("id" -> userid)
			Application.usersCollection.find(qb).cursor[User].toList.map  { l =>
			  l.head
			}
	}
	
	private def getUserByEmail(email: String) = {
			val qb = Json.obj("email" -> email)
			Application.usersCollection.find(qb).cursor[JsObject].toList.map  { l =>
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
				  getUserByEmail(value.email).map(f => {
					  val pass = (f.\("pass").asOpt[String])
					  if(pass != None && BCrypt.checkpw(value.password, pass.get)) {
					    val fn = f.\("firstName").as[String]
					    val userid = f.\("id").as[String]
					    val rfavs = f.\("rfavs").asOpt[Set[String]].getOrElse(Set[String]())
					    val modifier = Json.obj("userid" -> userid, "time" -> DateTime.now())
					    Application.loginsCollection.insert(modifier).map {
							e => {
							  Ok
							}
						}
						val token = UUID.randomUUID().toString()
						val sessionObjStr = Json.stringify(Json.toJson(new SessionObj(token = token, fn = fn, userid = userid, rfavs = rfavs)))
					    Ok(sessionObjStr).withSession("session" -> sessionObjStr)
					  }else 
					    BadRequest(Json.obj("em" -> "Invalid email or password"))
				  }).recover{
				  		case e => BadRequest(Json.obj("em" -> "Invalid email or password"))
				  }
			  }
			})
	}
	
	def logout = Action { implicit request =>
	  Ok.withNewSession
	}
	
	private def  setNewTokenForUserByEmail(email: String, token: String) = {
		
		val selector = BSONDocument("email" -> email)
		val modifier = BSONDocument("$set" -> BSONDocument("token" -> token))
		
		/*Application.usersCollection.update(selector = selector, update = modifier, upsert = true).map {
					e => {
					  true
					}
				}	
	  */
		Application.db.command(FindAndModify(Application.usersCollection.name, selector, Update(modifier, true)))
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
				  setNewTokenForUserByEmail(value.email, token).map(
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
			  val modifier = Json.obj(
						"firstName" -> value.firstName,
						"lastName" -> value.lastName,
						"email" -> value.email,
						"response" -> "0",
						"token" -> token,
						"created" -> DateTime.now())
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
				    	WS.url("https://mandrillapp.com/api/1.0/messages/send-template.json").post(
				    	    Mandrill.createRegistrationConfirmRequest(value.email, "http://"+request.host, token)).map(f => Logger.debug(f.json.toString)
				    	)
				  		Ok("")
			  	}.recover {
			  	  case e =>
			  	    val isDuplicate = e.getMessage().indexOf("E11000 duplicate key error") != -1
			  	    if(isDuplicate) 
			  	      BadRequest(Json.obj("em" -> "Already exists"))
			  	    else 
			  	      BadRequest(Json.obj("em" -> e.getMessage()))
			  	}
			  }
			})
	}
	
	private def getSignupByToken(token: String) = {
			val qb = Json.obj("token" -> token)
			Application.signupsCollection.find(qb).cursor[JsObject].toList.map  { l =>
				l.head
			}
	}
	private def createUserByToken(token: String, password: String) = {
	 	  
	  for {
		  signupOpt <- {
			  val qb = BSONDocument("token" -> token)
			  val modifier = BSONDocument("$set" -> BSONDocument("reg" -> true, "token" -> "0"))
			  Application.db.command(FindAndModify(Application.signupsCollection.name, qb, Update(modifier, true)))
		  }
		  user <- {
		    signupOpt match {
		      case Some(signup) => {
		    	  val userId = UniqueCode.getRandomCode
		    	  val modifier = Json.obj(
		    			"id" -> userId,  
						"firstName" -> signup.getAs[BSONString]("firstName").get.value,//\("firstName").as[String],
						"lastName" -> signup.getAs[BSONString]("lastName").get.value,
						"email" -> signup.getAs[BSONString]("email").get.value,
						"pass" ->  BCrypt.hashpw(password, BCrypt.gensalt()),
						"created" -> DateTime.now())
		    	  Application.usersCollection.insert(modifier).map {
		    	    e => modifier
		    	  }
		      }
		      case _ => throw new Exception("Token: " + token + " is invalid")
		    }
		  }
	  } yield user
	  
	}
	
	val savePasswordForm: Form[Password] = Form(
		mapping(
			"ps" -> nonEmptyText
		)(Password.apply)(Password.unapply))
	
	def createUser(token: String) = Action {  implicit request =>
	  
	  savePasswordForm.bindFromRequest.fold(
			formWithErrors => {
			  BadRequest(formWithErrors.errorsAsJson) 
			},
			value => {
			  Async {
				val sessionToken = UUID.randomUUID().toString()
				createUserByToken(token, value.password).map{
				  user => {
				    val fn = user.\("firstName").as[String]
				    val userid = user.\("id").as[String]
				    val rfavs = user.\("rfavs").asOpt[Set[String]].getOrElse(Set[String]())
				    val sessionObjStr = Json.stringify(Json.toJson(new SessionObj(token = sessionToken, fn = fn, userid = userid, rfavs = rfavs)))
					    Ok(sessionObjStr).withSession("session" -> sessionObjStr)
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
	
	def user(id: String) = Authenticated.auth { implicit request =>
		Async {
		  
		  val profile = for {
						   user <- getUserById(id)
						   recipes <- RecipeController.getRecipes("userid", id)
					  } yield {
					    Ok(Json.obj("info" -> user, "recipes" -> recipes))
					  }
		   profile
		}
	}
	
	case class Message(subject: String, message: String, email: String)
	
	val saveMessageForm: Form[Message] = Form(
		mapping(
			"subject" -> nonEmptyText,
			"message" -> nonEmptyText,
			"em" -> nonEmptyText
		)(Message.apply)(Message.unapply))
	
	def saveEmail = Action { implicit request =>
	  
	  saveMessageForm.bindFromRequest.fold(
			formWithErrors => {
			  BadRequest(formWithErrors.errorsAsJson) 
			},
			value => {
			  val modifier = Json.obj("subject" -> value.subject, "message" -> value.message, "email" -> value.email)
			  Async {
				  Application.emailsCollection.insert(modifier).map {
					e => {
					  Ok
				    }
				  } 
			  }  
			}
	  )
	}
	
	case class LikeRecipe(recipeId: String, toLike: Boolean)
	
	val setLikeRecipeForm: Form[LikeRecipe] = Form(
		mapping(
			"recipeId" -> nonEmptyText,
			"toLike" -> boolean
		)(LikeRecipe.apply)(LikeRecipe.unapply))
	
	def setLikeRecipe = Authenticated.auth {  implicit request =>
	  
	  setLikeRecipeForm.bindFromRequest.fold(
			formWithErrors => {
			  BadRequest(formWithErrors.errorsAsJson) 
			},
			value => {
			  
			  val selector = Json.obj("id" -> request.user.id)
			  val modifier = if(value.toLike)Json.obj("$addToSet" -> Json.obj("rfavs" -> value.recipeId)) else Json.obj("$pull" -> Json.obj("rfavs" -> value.recipeId))
			  val recipeSelector = Json.obj("id" -> value.recipeId)
			  val increase = if(value.toLike) 1 else -1
			  val recipeModifier = Json.obj("$inc" -> Json.obj("stats.likes" -> increase)) 
			  Async {
			    Application.usersCollection.update(selector = selector, update = modifier).map {
			    	e => {
			    	  Application.recipeCollection.update(recipeSelector, recipeModifier)
			    	  val sessionObj = Json.parse(request.session.get("session").getOrElse("")).as[SessionObj]
			    	  val newSession = Json.stringify(Json.toJson(new SessionObj(
			    	      token = sessionObj.token, 
			    	      fn = sessionObj.fn, 
			    	      userid = sessionObj.userid, 
			    	      if(value.toLike) (sessionObj.rfavs + value.recipeId) else sessionObj.rfavs.filter(_!=value.recipeId))))
			    	  Ok.withSession("session" -> newSession)
			    	}
		    	}
			  }
			  
			  
			}
	  )
	}
}