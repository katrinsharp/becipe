package controllers

import play.api._
import play.api.mvc._
import reactivemongo.api._
import play.api.Play.current
import play.modules.reactivemongo._
import services.SmtpConfig
import services.EmailService
import play.modules.reactivemongo.json.collection.JSONCollection
import models.Category
import play.api.libs.json.Json

object Application extends Controller{

	val db = ReactiveMongoPlugin.db
	//lazy val recipeCollection = db("recipes")
	lazy val recipeCollection: JSONCollection = db.collection[JSONCollection]("recipes")
	lazy val signupsCollection: JSONCollection =  db.collection[JSONCollection]("signups")
	lazy val usersCollection: JSONCollection =  db.collection[JSONCollection]("users")
	lazy val loginsCollection: JSONCollection =  db.collection[JSONCollection]("logins")
	lazy val emailsCollection: JSONCollection =  db.collection[JSONCollection]("emails")
	lazy val blogEntriesCollection: JSONCollection = db.collection[JSONCollection]("blogentries")
	
	//email service
	lazy val defaultSmtpConfig = new SmtpConfig(host = Play.application.configuration.getString("smtp.host").getOrElse(""),
	    										port = Play.application.configuration.getString("smtp.port").getOrElse("0") toInt,
	    										user = Play.application.configuration.getString("smtp.username").getOrElse(""),
	    										password = Play.application.configuration.getString("smtp.password").getOrElse("")
		)
	lazy val emailService = EmailService
	
	lazy val mandrillApiKey = Play.application.configuration.getString("mandrill.apikey").getOrElse("")
	
	//default is local
	val useLocalStorage = Play.application.configuration.getString("save.to").getOrElse("local").equalsIgnoreCase("local")
	
	val categories = List(new Category("skincare", "Skincare"),
	    new Category("haircare", "Hair Care"),
	    new Category("spa", "Spa"),
	    new Category("soap", "Soap"),
	    new Category("makeup", "Makeup"),
	    new Category("aromatherapy", "Aromatherapy"),
	    new Category("pets", "Pets care"),
	    new Category("menscare", "Mens care"))
	
	def index = Action { implicit request =>
		Logger.info("mongodb.uri: "+Play.current.configuration.getString("mongodb.uri").getOrElse("").split("@")(1))
		val catStr = Json.stringify(Json.toJson(categories))
		Ok(views.html.index(catStr))
	}
	
	def javascriptRoutes = Action {  implicit request =>
		import routes.javascript._
    Ok(
      Routes.javascriptRouter("jsRoutes")(
      )
    ).as("text/javascript")
  }
}