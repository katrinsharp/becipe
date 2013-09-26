package auth

import play.api.mvc._
import play.api.Logger
import play.api.mvc.Results._
import scala.util.Try
import models.User
import controllers.UserController
import play.api.libs.concurrent.Execution.Implicits._

case class AuthenticatedRequest(
  val user: User, request: Request[AnyContent]
) extends WrappedRequest(request)

object Authenticated {
	def auth(f: AuthenticatedRequest => Result) = {
	  Action { request =>
	       	val sessionToken = request.session.get("token").getOrElse("")
		    val headerToken = request.headers.get("token").getOrElse("")
		    Logger.debug(s"sessionToken: $sessionToken, headerToken: $headerToken")
		    if(sessionToken=="") Unauthorized
		    else if(sessionToken!=headerToken) Unauthorized
		    else {
		      val userF = UserController.getUserById(request.session.get("userid").getOrElse(""))
		      Async {
		    	   userF.map { user => 
		    	   	f(AuthenticatedRequest(user, request)) 
		    	   }
		      }
		    }       
	  	}
	}
}


/*case class Authenticated[A](action: Action[A]) extends Action[A] {
  
  def apply(request: Request[A]): Result = {
    
    val sessionToken = request.session.get("token").getOrElse("")
    val headerToken = request.headers.get("token").getOrElse("")
    if(sessionToken=="") Unauthorized
    else if(sessionToken!=headerToken) Unauthorized
    else {
      val userF = UserController.getUserById(request.headers.get("userid").getOrElse(""))
      Async {
    	   userF.map { user => 
    	   	action(AuthenticatedRequest(user, request)) 
    	   }
      }
    }
  }
  
  lazy val parser = action.parser
}*/