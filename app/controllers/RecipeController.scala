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
  
  private def getRecipe(id: String): Option[Recipe] = {
		val qb = QueryBuilder().query(Json.obj("id" -> id))
		val futureRecipe = Application.recipeCollection.find[JsValue](qb).toList.map(
				_.headOption match {
					case Some(h) => Some(h.as[Recipe])
					case _ => None
				})				
		val duration10000 = Duration(100000, "millis")
		val recipe = Await.result(futureRecipe, duration10000).asInstanceOf[Option[Recipe]]
		recipe
	}
		

	def get(id: String) = Action { implicit request =>
		Async {
			val oRecipe = getRecipe(id)	
			oRecipe match {
				case Some(recipe) => {
					val qbAll = QueryBuilder().query(Json.obj())
					Application.recipeCollection.find[JsValue](qbAll).toList(4).map  { relatedRecipes =>
						Ok(views.html.recipes.recipe(recipe, relatedRecipes.map(r => r.as[Recipe])))
					}
				}
				case _ => Future(BadRequest(s"Recipe $id was not found"))
			}
		}
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
			  queryValues.map(x => Json.obj("name" -> Json.obj("$regex" -> ((new Regex("(?i)"+x+""))).toString())))++
			  queryValues.map(x => Json.obj("shortDesc" -> Json.obj("$regex" -> (new Regex("(?i)"+x)).toString())))
			  		  
			  Logger.debug(tags.toString())
			 
			Async {
				val qb = QueryBuilder().query(Json.obj("$or" -> tags))
				Application.recipeCollection.find[JsValue](qb).toList.map { recipes =>
					Ok(views.html.index(recipes.map(r => r.as[Recipe])))
				}
		   }
		})
  }

}