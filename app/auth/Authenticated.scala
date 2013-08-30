package auth

import play.api.mvc._
import play.api.Logger
import play.api.mvc.Results._
import scala.util.Try

case class Authenticated[A](action: Action[A]) extends Action[A] {
  
  def apply(request: Request[A]): Result = {
    
    /*val result = Try(for {
      clientToken <- request.headers.get("token").get
      serverToken <- request.session.get("token").get
    } yield {
      if(clientToken == serverToken) action(request) else Unauthorized
    }) 
    Logger.debug(result.toString())
    if(result.isSuccess) result.get(0) else Unauthorized
    */
    val sessionToken = request.session.get("token").getOrElse("")
    val headerToken = request.headers.get("token").getOrElse("")
    if(sessionToken=="") Unauthorized
    else if(sessionToken!=headerToken) Unauthorized
    else action(request)
  }
  
  lazy val parser = action.parser
}