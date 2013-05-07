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
import play.api.data.Form
import play.api.data.Forms._
import play.api.data.validation.Constraints._
import play.api.data.format.Formats._
import views.html.defaultpages.badRequest
import play.api.data.FormError
import views.html.defaultpages.error
import models.S3Photo
import java.io.File
import javax.imageio.ImageIO
import org.imgscalr.Scalr
import utils.Image
import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.concurrent.Future
import play.api.data.FormError
import models.S3PhotoMetadata
import models.RecipePhase
import org.joda.time.DateTime
import utils.UniqueCode
import models.photos
import scala.util.matching.Regex

case class RecipeSubmit(recipe: Recipe, s: Seq[photos] = List())
case class SearchRecipesSubmit(query: String, categories: List[String])

object RecipeController extends Controller with MongoController {
  
  def get(id: String) = Action { implicit request =>
    Ok(views.html.signup())
  }
  
  val searchRecipesForm: Form[SearchRecipesSubmit] = Form(
		mapping(
			"query" -> text,
			"categories" -> list(text)
		)(SearchRecipesSubmit.apply)(SearchRecipesSubmit.unapply))
  
  def search()= Action { implicit request =>
    searchRecipesForm.bindFromRequest.fold(
			formWithErrors => {
			  Logger.debug(formWithErrors.toString)
			  BadRequest 
			},
			value => {
			  Logger.debug(value.toString)
			  
			  val queryValues = value.query.split(" ") 
			  val tags = value.categories.map(x=>Json.obj("tags" -> x))++
			  queryValues.map(x => Json.obj("directions" -> Json.obj("$regex" -> (new Regex("(?i)"+x)).toString())))++
			  queryValues.map(x => Json.obj("phases.ingredients" -> Json.obj("$regex" -> (new Regex("(?i)"+x)).toString())))++
			  //queryValues.map(x => Json.obj("name" -> Json.obj("$regex" -> (new Regex("(?i).*("+x+").*")).toString())))++
			  queryValues.map(x => Json.obj("name" -> Json.obj("$regex" -> ((new Regex("(?i)"+x+""))).toString())))++
			  queryValues.map(x => Json.obj("shortDesc" -> Json.obj("$regex" -> (new Regex("(?i)"+x)).toString())))
			  		  
			  Logger.debug(tags.toString())
			 
			Async {
				val qb = QueryBuilder().query( Json.obj("$or" -> tags))
				Application.recipeCollection.find[JsValue](qb).toList.map { recipes =>
					Ok(views.html.index(recipes.map(r => r.as[Recipe])))
				}
		   }
		})
  }

}