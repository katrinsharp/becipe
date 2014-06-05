package controllers

import utils.{Image, UniqueCode}
import play.api._
import play.api.mvc._
import reactivemongo.api._
import reactivemongo.bson._
import play.modules.reactivemongo._
import play.api.libs.json._
import play.api.Play.current
import models.Recipe
import play.api.data.Form
import play.api.data.Forms._
import play.api.data.validation.Constraints._
import play.api.data.format.Formats._
import views.html.defaultpages.badRequest
import play.api.data.FormError
import models.S3Photo
import java.io.File
import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.concurrent.Future
import play.api.data.FormError
import models.S3PhotoMetadata
import models.RecipePhase
import org.joda.time.DateTime
import models.photos
import scala.util.matching.Regex
import services.EmailMessage
import reactivemongo.core.commands.FindAndModify
import reactivemongo.core.commands.Update
import play.api.libs.concurrent.Akka
import auth.Authenticated
import scala.util.Try
import scala.util.Success
import scala.util.Failure
import java.util.UUID
import play.api.cache.Cache 
import models.RequestState
import models.StatusVal
import models.Stats

case class RecipeSubmit(recipe: Recipe, s: Seq[photos] = List())
case class SearchRecipesSubmit(level: Option[String] = Some(""), query: Option[String] = Some(""), categories: List[String])

object RecipeController extends Controller with MongoController {
  
//  val recipeForm: Form[RecipeSubmit] = Form(
//		mapping(
//			"recipe" -> mapping(	
//			"id" -> nonEmptyText,			
//			"name" -> nonEmptyText,			
//			"shortDesc" -> nonEmptyText.verifying("This field is required", (_.trim().length() > 3)),			
//			"created" -> jodaDate("yyyy-MM-dd'T'HH:mm:ssZZ"),			
//			"by" -> nonEmptyText,
//			"directions" -> nonEmptyText.verifying("This field is required", (_.trim().length() > 3)),
//			"ingredients" -> seq(text),
//			"phases" -> seq(mapping(
//					"description" -> text,
//					"ingredients" -> seq(text)
//					)(RecipePhase.apply)(RecipePhase.unapply)),			
//			"prepTime" -> nonEmptyText,	
//			"readyIn" -> optional(text),
//			"recipeYield" -> nonEmptyText,	
//			"supply" -> optional(text),
//			"level" -> text.verifying("should be on of beginner, average or master", {_.matches("""^beginner|average|master""")}),			
//			"tags" -> seq(nonEmptyText),
//			"rating" -> ignored(0),
//			"draft" -> optional(boolean),
//			"photos" -> ignored(Seq[S3Photo]())
//			)(Recipe.apply)(Recipe.unapply),
//			"removed" -> seq(mapping(
//					"photoId" -> text,
//					"originKey" -> text,
//					"removedPhoto" -> boolean
//					)(photos.apply)(photos.unapply))
//			)(RecipeSubmit.apply)(RecipeSubmit.unapply))
//			
//	
//			def submitRecipe = Action {  implicit request =>
//		recipeForm.bindFromRequest.fold(
//			formWithErrors => {BadRequest(views.html.recipes.recipe_add_form(formWithErrors))},
//			value => {
//				val id = value.recipe.id match {
//							case "-1" => UniqueCode.getRandomCode
//							case v => v
//						}
//				Async {
//					
//					val newRecipe = (id != value.recipe.id)
//					
//					var photos = List[S3Photo]()
//					var originalPhotos = List[S3Photo]()
//					var isPreviewSet = false
//					
//					if(!newRecipe) {
//						val recipe = getRecipe(id)
//						recipe match {
//							case Some(r) => photos = photos ++ r.photos
//							case _ =>
//						}
//						originalPhotos = photos
//					}
//					
//					Logger.debug("photos: "+photos.length)
//					photos.foreach(f => Logger.debug(f.key))
//					Logger.debug(s"removed: "+value.s.toString)
//					
//					//val removedPhotos = photos.filter(p => {
//					//	val found = value.s.find(_.key == p.key)
//					//	found.isDefined && found.get.isRemoved 
//					//})
//					
//					photos = photos.filterNot(p => {
//						value.s.find(removed => removed.isRemoved && (removed.originKey == p.key || removed.originKey == p.metadata.originKey)).isDefined
//					})
//					
//					Logger.debug("photos: "+photos.length)
//					
//					val files = request.body.asMultipartFormData.toList
//					
//					for(i <- 0 to files.length - 1) {
//						files(i).files.map { file =>
//							if(file.ref.file.length() != 0) {
//								Logger.debug("next file")
//								val original = S3Photo.save(Image.asIs(file.ref.file), "original", "")
//								photos = photos :+ original 
//								photos = photos :+ S3Photo.save(Image.asSlider(file.ref.file), "slider", original.key)
//								if(!isPreviewSet) {
//									photos = photos :+ S3Photo.save(Image.asPreviewRecipe(file.ref.file), "preview", original.key)
//									isPreviewSet = true
//								} 
//							}
//						}
//					}
//					
//					Logger.debug(value.toString)
//					
//					photos.length match {
//						case 0 => Future(BadRequest(views.html.recipes.recipe_add_form(
//								recipeForm.fill(value).withError(FormError("recipe.photos", "Minimum one photo is required")), 
//								originalPhotos.filter(_.metadata.typeOf == "slider")
//								)))
//						case _ => {
//							val selector = Json.obj("id" -> value.recipe.id)
//							val modifier = Json.obj(
//								"id" -> id,
//								"name" -> value.recipe.name,
//								"shortDesc" -> value.recipe.shortDesc.trim(),
//								"created" -> value.recipe.created,
//								"by" -> value.recipe.by,
//								"directions" -> value.recipe.directions.trim(),
//								"prepTime" -> value.recipe.prepTime,
//								"readyIn" -> value.recipe.readyIn.getOrElse[String](""),
//								"recipeYield" -> value.recipe.recipeYield,
//								"supply" -> value.recipe.supply.getOrElse[String](""),
//								"level" -> value.recipe.level,
//								"ingredients" -> (if(value.recipe.ingredients.isDefinedAt(0)) value.recipe.ingredients(0).split(",").map(_.trim()) else ""),
//								"phases" -> value.recipe.phases.map(ph => RecipePhase(ph.description, ph.ingredients(0).split(",").map(_.trim()))),
//								"tags" -> value.recipe.tags(0).split(",").map(_.trim()),
//								"rating" -> value.recipe.rating,
//								//"draft" -> value.recipe.draft,
//								"photos" -> photos
//								)
//							newRecipe match {
//								case false => Application.recipeCollection.update(selector, modifier).map {
//									e => {
//										Logger.debug(e.toString)
//										/*
//										 * delete associated files
//										 */
//										
//										
//										//for {
//										//	files <- Option(new File(path).listFiles)
//										//	file <- files if file.getName.endsWith(".jpg")
//										//} 
//										//file.delete()
//										
//										
//										//Redirect(routes.RecipeController.get(id))
//										Ok
//									}
//								}
//								case true => Application.recipeCollection.insert(modifier).map {
//									e => {
//									  Logger.debug(e.toString);
//									  //Redirect(routes.RecipeController.get(id))
//									  Ok
//									}
//								}
//							}
//						}	
//					}
//					
//				} 
//			}
//		)
//	}
  
//  	def edit(id: String) = Action { implicit request =>
//		Async {
//			val qb = Json.obj("id" -> id)
//			Application.recipeCollection.find(qb).cursor[JsObject].toList.map { recipes =>
//				val recipe = recipes.head.as[Recipe]
//				Ok(views.html.recipes.recipe_add_form(recipeForm.fill(RecipeSubmit(recipe)), recipe.photos.filter(_.metadata.typeOf == "slider")))
//			}
//		}
//	}
	
  
//	private def getRecipe(id: String): Option[Recipe] = {
//		val qb = Json.obj("id" -> id)
//		val futureRecipe = Application.recipeCollection.find(qb).cursor[JsObject].toList.map(
//				_.headOption match {
//					case Some(h) => Some(h.as[Recipe])
//					case _ => None
//				})				
//		val duration10000 = Duration(100000, "millis")
//		val recipe = Await.result(futureRecipe, duration10000).asInstanceOf[Option[Recipe]]
//		recipe
//	}
	
	/*def by(categories: List[String]) = Action { implicit request =>
	  	Logger.debug(categories.toString)
		Ok
	}*/
	
//	def add() = Action { implicit request =>
//		Ok(views.html.recipes.recipe_add_form(recipeForm))
//	}
  
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
			  	
			  val searchQuery = Json.obj("$and" -> (List(Json.obj("draft" -> Json.obj("$ne" -> "t")))++List(Json.obj("$or" -> tags))))
			  		  
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
    	val qbAll = Json.obj("draft" -> Json.obj("$ne" -> "t"))//Json.obj("by" -> "Becipe", "draft" -> Json.obj("$ne" -> "t"))
    	Application.recipeCollection.find(qbAll).sort(Json.obj("created" -> -1)).cursor[JsObject].toList.map  { homepageRecipes =>
			Ok(Json.toJson(homepageRecipes))
		}
     }
  }
  
  def getRandomRecipes(n: Int) = Action { implicit request =>
    
     Async {
    	val qbAll = Json.obj("draft" -> Json.obj("$ne" -> "t"))
    	Application.recipeCollection.find(qbAll).cursor[JsObject].toList.map {recipes => Ok(Json.toJson(recipes.take(n)))}
    }
  }
  
  private def searchRecipes(query: String, filter: String, userid: String, level: String) = {
	  
	  val queryValues = query.split(" ")
	  val filterValues = filter.split("&")
	  
	  Logger.debug("queryValues:"+queryValues(0))
	  Logger.debug("filterValues:"+filterValues(0))
			  
	  val searchTerms = if(queryValues(0).length()!=0){
		  					List(Json.obj("$or" ->
							    (queryValues.map(x => Json.obj("directions" -> Json.obj("$regex" -> (new Regex("(?i)"+x)).toString())))++
							    //queryValues.map(x => Json.obj("phases.ingredients" -> Json.obj("$regex" -> (new Regex("(?i)"+x)).toString())))++
							    queryValues.map(x => Json.obj("name" -> Json.obj("$regex" -> ((new Regex("(?i)"+x+""))).toString())))++
							    queryValues.map(x => Json.obj("tags" -> Json.obj("$regex" -> (new Regex("(?i)"+x)).toString())))++
							    queryValues.map(x => Json.obj("shortDesc" -> Json.obj("$regex" -> (new Regex("(?i)"+x)).toString())))
							 )))} else Nil
	 
	  //val level = List(Json.obj("level" -> level.getOrElse("").toString()))	
							 
	  Logger.debug(searchTerms.toString)
	
					  	
	  val tags = if(filterValues(0).length()!=0){
		  				List(Json.obj("categories" -> Json.obj("$in" -> filterValues)))
	  			} else Nil
	  
	  val userQ = if(userid.length()!=0){
		  				List(Json.obj("userid" -> userid))
	  			} else Nil
	  
	 val levelQ = if(level.length()!=0){
		  				List(Json.obj("level" -> level))
	  			} else Nil
	  	
	  val searchQuery = Json.obj("$and" -> (List
	      (Json.obj("draft" -> Json.obj("$ne" -> "t")))++
	      searchTerms++
	      tags++
	      userQ++
	      levelQ
	  ))
	  		  
	  Logger.debug(searchQuery.toString())
	 
	  Async {
		Application.recipeCollection.find(searchQuery).cursor[JsObject].toList.map { recipes =>
			Ok(Json.toJson(recipes))
		}
	  }
  }
  
  def recipes(query: String, filter: String, userid: String, level: String) = Action { implicit request =>
      query match {
        case "homepage" => homepagerecipes
        case q => searchRecipes(q, filter, userid, level)
      }
  }
  
  
  def getRecipes(attrName: String, attrValue: String) = {
    
		val qb = Json.obj(attrName -> attrValue)
		Application.recipeCollection.find(qb).cursor[JsObject].toList.map  { l =>
			l
		}
  }
  
  def getFacebookRecipeById(id: String) = Action { implicit request =>
    
     Async {
    	 val recipeF = Application.recipeCollection.find(Json.obj("id" -> id)).cursor[Recipe].toList
          recipeF.map {recipes => { 
    		val recipe = recipes.head
    		request.headers.get("user-agent").getOrElse("").contains("facebookexternalhit") match {
    		  case true => Ok(views.html.facebook_recipe(recipe)) 
    		  case false => Redirect("http://" + request.host + "/#recipe/" + id)
    		}
    	  }
      }
    }
  }
  
  def getRecipeById(id: String) = Action { implicit request =>
    
    Async {
      
      for {
        tmp <- {
        	val recipeSelector = Json.obj("id" -> id)
        	val recipeModifier = Json.obj("$inc" -> Json.obj("stats.views" -> 1))
			Application.recipeCollection.update(recipeSelector, recipeModifier)
        }
        result <- {
          val recipeF = getRecipes("id", id)
          recipeF.map {recipes => { 
    		val recipe = recipes.head
    		Ok(Json.toJson(recipe))
    	  }
        } 
      }	
    } yield {
      result
    }
  }
 }
  
  def getRecipeByUserId(id: String) = Action { implicit request =>
    
     Async {
    	val recipeF = getRecipes("userid", id)
    	recipeF.map {recipe => Ok(Json.toJson(recipe))}
    }
  }
  
  val recipeAddForm: Form[Recipe] = Form(
		mapping(
			"id" -> default(text, "-1"),			
			"name" -> nonEmptyText,			
			"shortDesc" -> nonEmptyText,//nonEmptyText.verifying("This field should be longer than that", (_.trim().length() > 3)),			
			"created" -> jodaDate("yyyy-MM-dd'T'HH:mm:ssZZ"),			
			"by" -> ignored(""),
			"userid" -> ignored(""),
			"directions" -> nonEmptyText,//nonEmptyText.verifying("This field should be longer than that", (_.trim().length() > 3)),
			"ingredients" -> text.transform[Seq[String]](x=>x.split(";").map(_.trim()), l=> l.headOption.getOrElse("")),
			//"phases" -> seq(mapping(
			//		"description" -> text,
			//		"ingredients" -> seq(text)
			//		)(RecipePhase.apply)(RecipePhase.unapply)),			
			"prepTime" -> nonEmptyText,	
			"readyIn" -> optional(text),
			"recipeYield" -> nonEmptyText,	
			"supply" -> optional(text),
			"level" -> text.verifying("should be on of beginner, average or master", {_.matches("""^beginner|average|master""")}),			
			"tags" -> nonEmptyText.transform[Seq[String]](x=>x.split(",").map(_.trim()), l=> l.headOption.getOrElse("")),
			"categories" -> nonEmptyText.transform[Seq[String]](x=>x.split(",").map(_.trim()), l=> l.headOption.getOrElse("")),
			"stats" -> ignored(new Stats),
			"draft" -> text.verifying("should be t or f", {_.matches("""^t|f$""")}),
			"photos" -> ignored(Seq[S3Photo]())
			)(Recipe.apply)(Recipe.unapply))
  
  def addRecipe = Authenticated.auth {  implicit request =>
    //Logger.debug(recipeAddForm.toString)	
	recipeAddForm.bindFromRequest.fold(
		formWithErrors => {BadRequest(formWithErrors.errorsAsJson)},
		value => {
				addOrUpdate(value, request.user.firstName, request.user.id)
			})
	}
  
  case class AttributeValues(values: Seq[String])
	val recipeAttributesForm: Form[AttributeValues] = Form(
		mapping(
			"value" -> seq(nonEmptyText)
			)(AttributeValues.apply)(AttributeValues.unapply))
  
  def updateRecipe(id: String, attrNames: Option[String]) = Authenticated.auth {  implicit request =>
    
	    attrNames match {
	    	case None => recipeAddForm.bindFromRequest.fold(
	    				formWithErrors => {BadRequest(formWithErrors.errorsAsJson)},
	    					value => {
	    						addOrUpdate(value, request.user.firstName, request.user.id)
	    			})
	    	case Some(attrs) => recipeAttributesForm.bindFromRequest.fold(
	    							formWithErrors => {BadRequest(formWithErrors.errorsAsJson)},
	    								value => {
	    									partialUpdate(id, attrs.split(",").zip(value.values), request.user.id)
	    							})		
	    }
  		
	}
  
  	private def partialUpdate(id: String, attrs: Seq[(String, String)], userid: String) = {
  		
  		Async {
	  		val selector = Json.obj("id" -> id, "userid" -> userid)
	  		val modifier = Json.obj("$set" -> attrs.map(v => Json.obj(v._1 -> v._2)).foldLeft(Json.obj())((b, a) => b++a))
	  		
	  		Logger.debug(modifier.toString)
	  		
	  		Application.recipeCollection.update(selector = selector, update = modifier).map {
				e => {
				  Ok
				}
			}
  		}
  	}
  	
  	private def deletePhotos(id: String, keys: Seq[String], userid: String) = {
  		
  		Async {
	  		val selector = Json.obj("id" -> id, "userid" -> userid)
	  		//val modifier = Json.obj("$pull" -> Json.obj("photos" -> Json.obj("key" -> Json.obj("$in" -> keys))))
	  		
	  		val modifier = Json.obj("$pull" -> Json.obj("photos" -> Json.obj("$or" -> (Seq(Json.obj("key" -> Json.obj("$in" -> keys)))++Seq(Json.obj("metadata.originKey" -> Json.obj("$in" -> keys)))))))
	  		
	  		Logger.debug(modifier.toString)
	  		
	  		Application.recipeCollection.update(selector = selector, update = modifier).map {
				e => {
				  Ok
				}
			}
  		}
  	}
  	
  	def deleteRecipePhotos(id: String) = Authenticated.auth { implicit request =>
  	  
  		recipeAttributesForm.bindFromRequest.fold(
  				formWithErrors => {BadRequest(formWithErrors.errorsAsJson)},
			value => {
				deletePhotos(id, value.values, request.user.id)
    	})
  
  	}

	private def addOrUpdate(value: Recipe, by: String, userid: String) = {
	  val id = value.id match {
							case "-1" => UniqueCode.getRandomCode
							case v => v
						}
				Async {
					
					val newRecipe = (id != value.id)
					
					val selector = Json.obj("id" -> id, "userid" -> userid)
					val modifier = Json.obj(
								"id" -> id,
								"name" -> value.name,
								"shortDesc" -> value.shortDesc.trim(),
								"created" -> value.created,
								"by" -> by,
								"userid" -> userid,
								"directions" -> value.directions.trim(),
								"prepTime" -> value.prepTime,
								"readyIn" -> value.readyIn,
								"recipeYield" -> value.recipeYield,
								"supply" -> value.supply,
								"level" -> value.level,
								"ingredients" -> value.ingredients,
								//"phases" -> value.recipe.phases.map(ph => RecipePhase(ph.description, ph.ingredients(0).split(",").map(_.trim()))),
								"tags" -> value.tags,
								"categories" -> value.categories
								)++ (if(newRecipe) Json.obj("draft" -> "t") else Json.obj())
								
					val modifierWithPhotos = Json.obj("$set" -> (if(newRecipe) modifier ++ Json.obj("photos" -> List[S3Photo]()) ++ Json.obj("stats" -> new Stats)  else modifier))
					
					Logger.debug(modifierWithPhotos.toString)
					
					Application.recipeCollection.update(selector = selector, update = modifierWithPhotos, upsert = true, multi = false).map {
									e => {
									  Ok(Json.obj("id" -> id))
									}
								}			
								
					/*Application.db.command[JsObject](FindAndModify(Application.recipeCollection.name, selector, Update(modifier, true), true)).map{
					  f => 
					  	f match {
					  		case Some(_) => Ok(Json.obj("id" -> id))
					  		case None => BadRequest(Json.obj("error" -> "Unknown Error"))
					  	}
					}*/
				}
	} 
	
	case class FileNames(names: Seq[String])
	val recipeFileNamesForm: Form[FileNames] = Form(
		mapping(			
			"filenames" -> seq(nonEmptyText)			
			)(FileNames.apply)(FileNames.unapply))
  
	def uploadRecipePhotos(id: String) = Authenticated.auth { implicit request =>
    
    
    	val requestHandle = UUID.randomUUID().toString()
    	val userid = request.user.id
    	val files = request.body.asMultipartFormData.get.files
		Logger.debug("recipe id: "+id)
		Logger.debug("photos: "+files.length)

		val nonEmptyFiles = files.filter(_.ref.file.length() != 0)
		val total = nonEmptyFiles.length
		
		Cache.set(requestHandle, new RequestState(requestHandle = requestHandle, status=StatusVal.inprogress.toString(), processed = Some(0), total = Some(total)))//Json.obj("status" -> "inprogress", "processed" -> 0, "total" -> total))
      
    	val temp = for {
      
	    	 S3PhotosWithStatus <- {
	    		Akka.future {
				
					val resultsTries = nonEmptyFiles.zipWithIndex.map{case (file, i) => {
				
						Logger.debug("next file, length: "+file.ref.file.length())
					
						// TODO: better try to save slider first because it can throw exceptions while formatting the photo
						// we don't want to stuck with original saved.
						val saved = for {
							original <- Try(S3Photo.save(Image.asIs(file.ref.file), "original", ""))
							slider <- Try(S3Photo.save(Image.asSlider(file.ref.file), "slider", original.key))
							//preview <- Try(if(i==0) S3Photo.save(Image.asPreviewRecipe(file.ref.file), "preview", original.key) else null)
							preview <- Try(S3Photo.save(Image.asPreviewRecipe(file.ref.file), "preview", original.key))
						} yield {
							//Cache.set(requestHandle, Json.obj("status" -> "inprogress", "processed" -> (i+1), "total" -> total))
							Seq(original, slider, preview)//.filter(_ != null)
						}
						
						Cache.set(requestHandle, new RequestState(requestHandle = requestHandle, status=StatusVal.inprogress.toString(), processed = Some(i+1), total = Some(total)))
						saved
					}}
					val results = resultsTries.zipWithIndex.map { case (result, i) =>
						result  match {
							case Success(photos) => (null, photos)
							case Failure(ex) => {Logger.debug(ex.getMessage());("Picture should be at least 940x570 px", Seq())}
						}
					}
					Logger.debug(results.toString)
					results
				}.recover {
					case m: Throwable => Logger.error(m.getMessage());throw new Throwable("Internal error uploading pictures. Please try again later.")
				}
			}
	    	recipe <- {
	    		val recipesF = getRecipes("id", id)
	    		recipesF.map ( l =>
	    			l.head.as[Recipe]
	    		)
	    	} 
	    	isSuccess <- { 
	    		val selector = Json.obj("id" -> id, "userid" -> userid)
	    		val S3Photos = S3PhotosWithStatus.flatMap(_._2).toSeq
    			if(S3Photos.size > 0) { 
					
					Logger.debug("recipe.photos.length: "+recipe.photos.length)
					Logger.debug("recipe.draft: "+recipe.draft)
					
					val modifier = Seq(Json.obj("$addToSet" -> Json.obj("photos" -> Json.obj("$each" -> S3Photos)))
					    ++(if((recipe.photos.length==0)&&(recipe.draft=="t"))Json.obj("$set" -> Json.obj("draft" -> "f"))else Json.obj())).foldLeft(Json.obj())((b, a) => b++a)
					Logger.debug(modifier.toString)
					//val modifier = Json.obj("$addToSet" -> Json.obj("photos" -> Json.obj("$each" -> S3Photos)), "$unset" -> Json.obj("draft" -> ""))
					Application.recipeCollection.update(selector = selector, update = modifier).map {
						e => true 
					}	
				} else if(recipe.photos.length==0) {
					val modifier = Json.obj("$set" -> Json.obj("draft" -> "t"))
					Application.recipeCollection.update(selector = selector, update = modifier).map {
						e => true 
					}
				} else
				  Future(true)
	    	 }
    	} yield {	
    		val statuses = S3PhotosWithStatus.zipWithIndex.collect{ case ((st, _), i) if(st != null) => (i, st)}
    		val src = S3PhotosWithStatus.zipWithIndex.collect{ case ((st, photos), i) if(st == null) => (i, photos(1))}//slider
    		val error = if(statuses.length > 0) {
    			recipeFileNamesForm.bindFromRequest.fold(
    				formWithErrors => new RequestState(requestHandle = requestHandle, status = StatusVal.error.toString(), error = Some(formWithErrors.errorsAsJson.toString)),
    				    //Json.obj("status" -> "error", "error" -> "unknown"),
    				filenames => {
    					new RequestState(requestHandle = requestHandle, status=StatusVal.error.toString(), 
    					    errors = Some(statuses.map(st => new models.Error(filenames.names(st._1), st._2))), 
    					    successes = Some(src.map(src => new models.Success(filenames.names(src._1), src._2))))
    					/*Json.obj(
    					    "isPhotoError" -> "true",
    					    "status" -> "error",
    					    "errors" -> Json.toJson(statuses.map(st => Json.obj("name" -> filenames.names(st._1), "message" -> st._2))),
    					    "successes" -> Json.toJson(src.map(src => Json.obj("name" -> filenames.names(src._1), "src" -> src._2)))
    					)*/
    				})	
    		} else null
    		if(error!=null) 
    		  {Logger.debug(error.toString);Cache.set(requestHandle, error)/*BadRequest(error)*/}
    		else if((recipe.photos.length == 0) && (src.length == 0))
    		  Cache.set(requestHandle, new RequestState(requestHandle = requestHandle, status=StatusVal.error.toString(), error = Some("""
					   <p>The recipe was succesfully submitted, however it will remain in 'draft' state until at last one photo will be uploaded.</p>
					   <p>You can submit photos now or later by accessing your profile in main menu.</p>
					   """)))
    		  /*Cache.set(requestHandle, Json.obj("status" -> "error", "error" -> """
					   <p>The recipe was succesfully submitted, however it will remain in 'draft' state until at last one photo will be uploaded.</p>
					   <p>You can submit photos now or later by accessing your profile in main menu.</p>
					   """))*/
    		  /*BadRequest("""
					   <p>The recipe was succesfully submitted, however it will remain in 'draft' state until at last one photo will be uploaded.</p>
					   <p>You can submit photos now or later by accessing your profile in main menu.</p>
					   """)*/
			else Cache.set(requestHandle, new RequestState(requestHandle = requestHandle, status=StatusVal.success.toString()))//Json.obj("status" -> "success"))//Ok
    	}
    	Logger.debug(s"requestHandle: $requestHandle")
    	Ok(Json.obj("handleRequest" -> requestHandle))
	}

	def checkRequestStatus(requestHandle: String) = Authenticated.auth { implicit request =>
		val state = Cache.getAs[RequestState](requestHandle).getOrElse(
		    new RequestState(requestHandle = requestHandle, status=StatusVal.error.toString(), error=Some("status was not found")))	    
		Ok(Json.toJson(state))
	}
	
}