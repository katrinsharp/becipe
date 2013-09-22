import play.api._
import play.api.Play.current
import play.api.Logger
import play.api.mvc._
import play.api.http.HeaderNames._
import play.api.libs.json._
import play.api.mvc.Results._
import javax.imageio.ImageIO

object Global extends GlobalSettings {
  
  override def onStart(app: Application) = {
  	Logger.info("Starting application...")
  	ImageIO.setUseCache(false)
  }
  
  override def onError(request: RequestHeader, ex: Throwable) = {
	  BadRequest(Json.obj("error" -> ex.getMessage()))
  }  
  
  override def onHandlerNotFound(request: RequestHeader): Result = {
 
        // handle trailing slashes
        if (request.path.endsWith("/")) {
            // construct a new URI without the slash
            // request.path doesn't contain query strings
            // request.uri contains both the path and the query string
            val uri = request.path.take(request.path.length - 1) + {
                if (request.path == request.uri) "" // no query string
                else request.uri.substring(request.path.length)
            }
 
            Results.MovedPermanently(uri)
        }
        else // not my business. push it back to super class
            super.onHandlerNotFound(request)
    }
  
  	// CORS
  	/*override def doFilter(action: EssentialAction): EssentialAction = EssentialAction { request =>
  		action.apply(request).map(_.withHeaders(
  			"Access-Control-Allow-Origin" -> request.host,
  			"Access-Control-Max-Age" -> "300",//5 min
  			"Access-Control-Allow-Methods" -> "GET,POST,PUT"
  		))
  	}*/
  
  /*override def doFilter(action: EssentialAction): EssentialAction = EssentialAction { request =>
    action.apply(request).map(_.withHeaders(
      "x-content-security-policy-report-only" -> (""+
      	"allow *;"+ 
		"script-src https://*.becipe.com "+
		"http://*.becipe.com "+
		"*.google-analytics.com "+
      	"*.cloudfront.net "+
		"*.google.com "+
		"*.facebook.com "+
		"*.twitter.com "+
		"127.0.0.1:* "+
        "localhost:*;"+
		"options inline-script eval-script;"+ 
		"report-uri https://www.becipe.com/csp"),
		"X-Frame-Options" -> "GOFORIT"
    ))
  }*/
  
}
