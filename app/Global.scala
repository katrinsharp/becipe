import play.api._
import play.api.Play.current
import play.api.Logger
import play.api.mvc._
import play.api.http.HeaderNames._

object Global extends GlobalSettings {
  
  override def onStart(app: Application) = {
  	Logger.info("Starting application...")
  }
  
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
