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
	    	val (isAuth, userid) = isAuthenticated(request)
	    	if(!isAuth) Unauthorized
		    else {
		      val userF = UserController.getUserById(userid.get)
		      Async {
		    	   userF.map { user => 
		    	   	f(AuthenticatedRequest(user, request)) 
		    	   }
		      }
		    }       
	  	}
	}
	
	def isAuthenticated(request: Request[AnyContent]): Tuple2[Boolean, Option[String]] = {
	  
	  //val session = Try(request.session.get("session").map(x => Json.parse(x).asOpt[SessionObj])).toOption.flatten.getOrElse(new SessionObj("", "", "", Set()))
	  
	  //val session = Try(Json.parse(request.session.get("session").getOrElse("")).asOpt[SessionObj].getOrElse(new SessionObj("", "", "", Set()))).orElse(new SessionObj("", "", "", Set())))
	  
		val session = Json.parse(request.session.get("session").getOrElse("{}")).asOpt[SessionObj].getOrElse(new SessionObj("", "", "", Set()))
	   	val sessionToken = session.token
	    val headerToken = request.headers.get("token").getOrElse("")
	    Logger.debug(s"sessionToken: $sessionToken, headerToken: $headerToken")
	    if(sessionToken=="" || sessionToken!=headerToken) (false, None)
	    else (true, Some(session.userid))
	    
	}
}