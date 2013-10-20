package auth

import play.api.mvc._
import play.api.Logger
import play.api.mvc.Results._
import scala.util.Try
import models.User
import controllers.UserController
import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.json._
import models.SessionObj

case class AuthenticatedRequest(
  val user: User, request: Request[AnyContent]
) extends WrappedRequest(request)

object Authenticated {
	def auth(f: AuthenticatedRequest => Result) = {
	  Action { request =>
	    	val session = Json.parse(request.session.get("session").getOrElse("")).asOpt[SessionObj].getOrElse(new SessionObj("", "", "", Set()))
	       	val sessionToken = session.token
		    val headerToken = request.headers.get("token").getOrElse("")
		    Logger.debug(s"sessionToken: $sessionToken, headerToken: $headerToken")
		    if(sessionToken=="") Unauthorized
		    else if(sessionToken!=headerToken) Unauthorized
		    else {
		      val userF = UserController.getUserById(session.userid)
		      Async {
		    	   userF.map { user => 
		    	   	f(AuthenticatedRequest(user, request)) 
		    	   }
		      }
		    }       
	  	}
	}
}