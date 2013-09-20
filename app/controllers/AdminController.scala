package controllers

import utils.{Mandrill, UniqueCode}
import play.api._
import play.api.mvc._
import reactivemongo.api._
import reactivemongo.bson._
import play.modules.reactivemongo._
import play.api.libs.json._
import play.api.Play.current
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
import models.Signup


object AdminController extends Controller with MongoController{
	
	def resetAllZeroTokens = Authenticated.auth { implicit request =>
	  
	  	request.user.role match {
		  	  case Some("admin") => Async {
				for {
					signups <- Application.signupsCollection.find(Json.obj()).cursor[Signup].toList
					result <- {
						val emails = signups.filter(_.token=="0").map(_.email)
						for(email <- emails) {
							val selector = Json.obj("email" -> email)
							val firstName = signups.groupBy(_.email)(email).head.firstName
							val token = UUID.randomUUID().toString()
							val modifier = Json.obj("$set" -> Json.obj("token" -> token))
							Logger.debug(s"$email,$token,$firstName")
							val temp = Application.signupsCollection.update(selector = selector, update = modifier).map {
								e => {
									Ok
								}
							}
						}
						Future(Ok)
					}
				} yield {
					result
				}
			}
		  	case _ => Unauthorized   
	  	}
		
	}
}