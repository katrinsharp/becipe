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
import services.EmailMessage
import reactivemongo.core.commands.FindAndModify
import reactivemongo.core.commands.Update

case class RecipeSubmit(recipe: Recipe, s: Seq[photos] = List())
case class SearchRecipesSubmit(level: Option[String] = Some(""), query: Option[String] = Some(""), categories: List[String])

object RecipeController extends Controller with MongoController {
  
  val recipeForm: Form[RecipeSubmit] = Form(
		mapping(
			"recipe" -> mapping(	
			"id" -> nonEmptyText,			
			"name" -> nonEmptyText,			
			"shortDesc" -> nonEmptyText.verifying("This field is required", (_.trim().length() > 3)),			
			"created" -> jodaDate("yyyy-MM-dd'T'HH:mm:ssZZ"),			
			"by" -> nonEmptyText,
			"directions" -> nonEmptyText.verifying("This field is required", (_.trim().length() > 3)),
			"ingredients" -> seq(text),
			"phases" -> seq(mapping(
					"description" -> text,
					"ingredients" -> seq(text)
					)(RecipePhase.apply)(RecipePhase.unapply)),			
			"prepTime" -> nonEmptyText,	
			"readyIn" -> optional(text),
			"recipeYield" -> nonEmptyText,	
			"supply" -> optional(text),
			"level" -> text.verifying("should be on of beginner, average or master", {_.matches("""^beginner|average|master""")}),			
			"tags" -> seq(nonEmptyText),
			"rating" -> ignored(0),
			"draft" -> optional(boolean),
			"photos" -> ignored(Seq[S3Photo]())
			)(Recipe.apply)(Recipe.unapply),
			"removed" -> seq(mapping(
					"photoId" -> text,
					"originKey" -> text,
					"removedPhoto" -> boolean
					)(photos.apply)(photos.unapply))
			)(RecipeSubmit.apply)(RecipeSubmit.unapply))
			
	
			def submitRecipe = Action {  implicit request =>
		recipeForm.bindFromRequest.fold(
			formWithErrors => {BadRequest(views.html.recipes.recipe_add_form(formWithErrors))},
			value => {
				val id = value.recipe.id match {
							case "-1" => UniqueCode.getRandomCode
							case v => v
						}
				AsyncResult {
					
					val newRecipe = (id != value.recipe.id)
					
					var photos = List[S3Photo]()
					var originalPhotos = List[S3Photo]()
					var isPreviewSet = false
					
					if(!newRecipe) {
						val recipe = getRecipe(id)
						recipe match {
							case Some(r) => photos = photos ++ r.photos
							case _ =>
						}
						originalPhotos = photos
					}
					
					Logger.debug("photos: "+photos.length)
					photos.foreach(f => Logger.debug(f.key))
					Logger.debug(s"removed: "+value.s.toString)
					
					//val removedPhotos = photos.filter(p => {
					//	val found = value.s.find(_.key == p.key)
					//	found.isDefined && found.get.isRemoved 
					//})
					
					photos = photos.filterNot(p => {
						value.s.find(removed => removed.isRemoved && (removed.originKey == p.key || removed.originKey == p.metadata.originKey)).isDefined
					})
					
					Logger.debug("photos: "+photos.length)
					
					val files = request.body.asMultipartFormData.toList
					
					for(i <- 0 to files.length - 1) {
						files(i).files.map { file =>
							if(file.ref.file.length() != 0) {
								Logger.debug("next file")
								val original = S3Photo.save(Image.asIs(file.ref.file), "original", "")
								photos = photos :+ original 
								photos = photos :+ S3Photo.save(Image.asSlider(file.ref.file), "slider", original.key)
								if(!isPreviewSet) {
									photos = photos :+ S3Photo.save(Image.asPreviewRecipe(file.ref.file), "preview", original.key)
									isPreviewSet = true
								} 
							}
						}
					}
					
					Logger.debug(value.toString)
					
					photos.length match {
						case 0 => Future(BadRequest(views.html.recipes.recipe_add_form(
								recipeForm.fill(value).withError(FormError("recipe.photos", "Minimum one photo is required")), 
								originalPhotos.filter(_.metadata.typeOf == "slider")
								)))
						case _ => {
							val selector = QueryBuilder().query(Json.obj("id" -> value.recipe.id)).makeQueryDocument
							val modifier = QueryBuilder().query(Json.obj(
								"id" -> id,
								"name" -> value.recipe.name,
								"shortDesc" -> value.recipe.shortDesc.trim(),
								"created" -> value.recipe.created,
								"by" -> value.recipe.by,
								"directions" -> value.recipe.directions.trim(),
								"prepTime" -> value.recipe.prepTime,
								"readyIn" -> value.recipe.readyIn.getOrElse[String](""),
								"recipeYield" -> value.recipe.recipeYield,
								"supply" -> value.recipe.supply.getOrElse[String](""),
								"level" -> value.recipe.level,
								"ingredients" -> (if(value.recipe.ingredients.isDefinedAt(0)) value.recipe.ingredients(0).split(",").map(_.trim()) else ""),
								"phases" -> value.recipe.phases.map(ph => RecipePhase(ph.description, ph.ingredients(0).split(",").map(_.trim()))),
								"tags" -> value.recipe.tags(0).split(",").map(_.trim()),
								"rating" -> value.recipe.rating,
								//"draft" -> value.recipe.draft,
								"photos" -> photos
								)).makeQueryDocument
							newRecipe match {
								case false => Application.recipeCollection.update(selector, modifier).map {
									e => {
										Logger.debug(e.toString)
										/*
										 * delete associated files
										 */
										
										
										//for {
										//	files <- Option(new File(path).listFiles)
										//	file <- files if file.getName.endsWith(".jpg")
										//} 
										//file.delete()
										
										
										//Redirect(routes.RecipeController.get(id))
										Ok
									}
								}
								case true => Application.recipeCollection.insert(modifier).map {
									e => {
									  Logger.debug(e.toString);
									  //Redirect(routes.RecipeController.get(id))
									  Ok
									}
								}
							}
						}	
					}
					
				} 
			}
		)
	}
  
  	def edit(id: String) = Action { implicit request =>
		Async {
			val qb = QueryBuilder().query(Json.obj("id" -> id))
			Application.recipeCollection.find[JsValue](qb).toList.map { recipes =>
				val recipe = recipes.head.as[Recipe]
				Ok(views.html.recipes.recipe_add_form(recipeForm.fill(RecipeSubmit(recipe)), recipe.photos.filter(_.metadata.typeOf == "slider")))
			}
		}
	}
	
  
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
	
	/*def by(categories: List[String]) = Action { implicit request =>
	  	Logger.debug(categories.toString)
		Ok
	}*/
	
	def add() = Action { implicit request =>
		Ok(views.html.recipes.recipe_add_form(recipeForm))
	}
  
  val searchRecipesForm: Form[SearchRecipesSubmit] = Form(
		mapping(
		    "level" -> optional(text),
			"query" -> optional(text),
			"categories" -> list(text)
		)(SearchRecipesSubmit.apply)(SearchRecipesSubmit.unapply))
  
  /*def search()= Action { implicit request =>
    searchRecipesForm.bindFromRequest.fold(
			formWithErrors => {
			  Logger.debug(formWithErrors.toString)
			  BadRequest 
			},
			value => {
			  Logger.debug(value.toString)
			  
			  val queryValues = value.query.getOrElse("").split(" ")
			  
			  val tags = List(Json.obj("level" -> value.level.getOrElse("").toString()))++
			    value.categories.map(x=>Json.obj("tags" -> x))++
			  (if(queryValues(0).length()!=0){
			    queryValues.map(x => Json.obj("directions" -> Json.obj("$regex" -> (new Regex("(?i)"+x)).toString())))++
			    queryValues.map(x => Json.obj("phases.ingredients" -> Json.obj("$regex" -> (new Regex("(?i)"+x)).toString())))++
			    queryValues.map(x => Json.obj("name" -> Json.obj("$regex" -> ((new Regex("(?i)"+x+""))).toString())))++
			    queryValues.map(x => Json.obj("shortDesc" -> Json.obj("$regex" -> (new Regex("(?i)"+x)).toString())))
			  	} else List(Json.obj("tags" -> ("__dummy"))))
			  	
			  val searchQuery = Json.obj("$and" -> (List(Json.obj("draft" -> Json.obj("$ne" -> true)))++List(Json.obj("$or" -> tags))))
			  		  
			  Logger.debug(tags.toString())
			 
			Async {
				val qb = QueryBuilder().query(searchQuery)
				Application.recipeCollection.find[JsValue](qb).toList.map { recipes =>
					Ok(views.html.index(recipes.map(r => r.as[Recipe]), value.level.getOrElse("all")))
				}
		   }
		})
  }*/
  
  private def homepagerecipes = {
  	Async {
    	val qbAll = QueryBuilder().query(Json.obj("draft" -> Json.obj("$ne" -> true)))
    	Application.recipeCollection.find[JsValue](qbAll).toList(9).map  { homepageRecipes =>
			Ok(Json.toJson(homepageRecipes))
		}
     }
  }
  
  private def searchRecipes(query: String, filter: String, level: Option[String] = None) = {
	  
	  val queryValues = query.split(" ")
	  val filterValues = filter.split("&")
	  
	  Logger.debug("queryValues:"+queryValues(0))
	  Logger.debug("filterValues:"+filterValues(0))
			  
	  val searchTerms = if(queryValues(0).length()!=0){
		  					List(Json.obj("$or" ->
							    (queryValues.map(x => Json.obj("directions" -> Json.obj("$regex" -> (new Regex("(?i)"+x)).toString())))++
							    queryValues.map(x => Json.obj("phases.ingredients" -> Json.obj("$regex" -> (new Regex("(?i)"+x)).toString())))++
							    queryValues.map(x => Json.obj("name" -> Json.obj("$regex" -> ((new Regex("(?i)"+x+""))).toString())))++
							    queryValues.map(x => Json.obj("shortDesc" -> Json.obj("$regex" -> (new Regex("(?i)"+x)).toString())))
							 )))} else Nil
	 
	  //val level = List(Json.obj("level" -> level.getOrElse("").toString()))				  	
	
					  	
	  val tags = if(filterValues(0).length()!=0){
		  				List(Json.obj("tags" -> Json.obj("$in" -> filterValues)))
	  			} else Nil
	  	
	  val searchQuery = Json.obj("$and" -> (List
	      (Json.obj("draft" -> Json.obj("$ne" -> true)))++
	      searchTerms++
	      tags
	  ))
	  		  
	  Logger.debug(searchQuery.toString())
	 
	  Async {
		val qb = QueryBuilder().query(searchQuery)
		Application.recipeCollection.find[JsValue](qb).toList.map { recipes =>
			Ok(Json.toJson(recipes))
		}
	  }
  }
  
  def recipes(query: String, filter: String) = Action { implicit request =>
      query match {
        case "homepage" => homepagerecipes
        case q => searchRecipes(q, filter)
      }
  }
  
  
  def getAsJson(id: String) = Action { implicit request =>
    
    Async {
			val qb = QueryBuilder().query(Json.obj("id" -> id))
			Application.recipeCollection.find[JsValue](qb).toList.map  { l =>
				Ok(Json.toJson(l.head))
			}
		}
  }
  
  def addRecipe = Action {  implicit request =>
		recipeForm.bindFromRequest.fold(
			formWithErrors => {BadRequest(formWithErrors.errorsAsJson)},
			value => {
				val id = value.recipe.id match {
							case "-1" => UniqueCode.getRandomCode
							case v => v
						}
				AsyncResult {
					
					val newRecipe = (id != value.recipe.id)
					
					Logger.debug(value.toString)
					
					val selector = QueryBuilder().query(Json.obj("id" -> value.recipe.id)).makeQueryDocument
					val modifier = QueryBuilder().query(Json.obj("$set" -> Json.obj(
								"id" -> id,
								"name" -> value.recipe.name,
								"shortDesc" -> value.recipe.shortDesc.trim(),
								"created" -> value.recipe.created,
								"by" -> value.recipe.by,
								"directions" -> value.recipe.directions.trim(),
								"prepTime" -> value.recipe.prepTime,
								"readyIn" -> value.recipe.readyIn.getOrElse[String](""),
								"recipeYield" -> value.recipe.recipeYield,
								"supply" -> value.recipe.supply.getOrElse[String](""),
								"level" -> value.recipe.level,
								"ingredients" -> (if(value.recipe.ingredients.isDefinedAt(0)) value.recipe.ingredients(0).split(",").map(_.trim()) else ""),
								"phases" -> value.recipe.phases.map(ph => RecipePhase(ph.description, ph.ingredients(0).split(",").map(_.trim()))),
								"tags" -> value.recipe.tags(0).split(",").map(_.trim()),
								"rating" -> value.recipe.rating,
								//"draft" -> value.recipe.draft,
								"photos" -> List[S3Photo]()
								))).makeQueryDocument
					Application.db.command(FindAndModify(Application.recipeCollection.name, selector, Update(modifier, true), true)).map{
					  f => 
					  	f match {
					  		case Some(_) => Ok(Json.obj("id" -> id))
					  		case None => BadRequest(Json.obj("error" -> "Unknown Error"))
					  	}
					}
				} 
			})
	}
  
  def uploadRecipePhotos(id: String) = Action {  implicit request =>
    val files = request.body.asMultipartFormData.toList
	Logger.debug("recipe id: "+id)
    Logger.debug("photos: "+files.length)
	for(i <- 0 to files.length - 1) {
		files(i).files.map { file =>
			if(file.ref.file.length() != 0) {
				Logger.debug("next file, length: "+file.ref.file.length())
			}
		}
	}
    Ok
  }

}