package controllers

import play.api._
import play.api.mvc._
import reactivemongo.api._
import reactivemongo.bson._
import reactivemongo.bson.handlers.DefaultBSONHandlers._
import play.modules.reactivemongo._
import play.modules.reactivemongo.PlayBsonImplicits._
import play.api.libs.json._
import play.api.Play.current
import models.Recipe
import models.Signup
import play.api.data.Form
import play.api.data.Forms._
import play.api.data.validation.Constraints._
import org.joda.time.DateTime

case class SignupDetails(firstName: String, lastName: String, email: String)

object Application extends Controller with MongoController{

	val db = ReactiveMongoPlugin.db
	lazy val recipeCollection = db("recipes")
	lazy val signupsCollection = db("signups")
	
	//default is local
	val useLocalStorage = Play.application.configuration.getString("save.to").getOrElse("local").equalsIgnoreCase("local")

	def index = Action { implicit request =>
		Logger.info("mongodb.uri: "+Play.current.configuration.getString("mongodb.uri").getOrElse(""))
		Async {
			val qb = QueryBuilder().query(Json.obj())
			Application.recipeCollection.find[JsValue](qb).toList.map { recipes =>
				Ok(views.html.index(recipes.map(r => r.as[Recipe])))
			}
		}
	}
	
	val signupForm: Form[SignupDetails] = Form(
		mapping(
			"fn" -> nonEmptyText,
			"ln" -> nonEmptyText,
			"em" -> email
		)(SignupDetails.apply)(SignupDetails.unapply))
	
	def submitSignup = Action {  implicit request =>
	  signupForm.bindFromRequest.fold(
			formWithErrors => {
			  Logger.debug(formWithErrors.toString)
			  BadRequest 
			},
			value => {
			  Logger.debug(value.toString)
			  val modifier = QueryBuilder().query(Json.obj(
						"firstName" -> value.firstName,
						"lastName" -> value.lastName,
						"email" -> value.email,
						"created" -> DateTime.now())).makeQueryDocument
			  Application.signupsCollection.insert(modifier).map {
				  e => Logger.error(e.toString)
			  }
			  Ok
			})
	}
	
	def signup = Action { implicit request =>
	  Ok(views.html.signup())
	}
	
	def javascriptRoutes = Action {  implicit request =>
		import routes.javascript._
    Ok(
      Routes.javascriptRouter("jsRoutes")(
          routes.javascript.Application.signup
      )
    ).as("text/javascript")
  }
}