import play.Application
import play.api._
import play.api.Play.current
import utils.S3Blob
import play.api.Logger
import controllers.Application

object Global extends GlobalSettings {
  
  def onStart(app: Application) = {
  	Logger.info("Starting application...")
  	S3Blob.initialize(app)
  }
  
}
