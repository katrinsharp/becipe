package controllers

import utils.{Image, UniqueCode}
import play.api._
import play.api.mvc._
import reactivemongo.api._
import reactivemongo.bson._
import play.modules.reactivemongo._
import play.api.libs.json._
import play.api.Play.current
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
import models.BlogEntry


object BlogController extends Controller with MongoController {
  
  def getBlogEntries(attrName: String, attrValue: String) = {
    
		val qb = Json.obj(attrName -> attrValue)
		Application.blogEntriesCollection.find(qb).cursor[JsObject].toList.map  { l =>
			l
		}
  }
  
  def blogEntries(tagOpt: Option[String]) = Action { implicit request =>
     Async {
    	 
    	val query = Json.obj("draft" -> Json.obj("$ne" -> "t"))++tagOpt.map(tag => Json.obj("tags" -> Json.obj("$in" -> List(tag)))).getOrElse(Json.obj())
    	Application.blogEntriesCollection.find(query).cursor[JsObject].toList.map  { l =>
			Ok(Json.toJson(l))
		}
     }
  }
  
  def recentBlogEntries(n: Int) = Action { implicit request =>
    
     Async {
    	val qbAll = Json.obj("draft" -> Json.obj("$ne" -> "t"))
    	Application.blogEntriesCollection.find(qbAll).sort(Json.obj("created" -> -1)).cursor[JsObject].toList.map {blogEntries => Ok(Json.toJson(blogEntries.take(n).map(x => Json.obj("id" -> x \ "id", "name" -> x \ "name"))))}
    }
  }
  
  
  
  def getFacebookBlogEntryById(id: String) = Action { implicit request =>
    
     Async {
    	 val blogEntriesF = Application.blogEntriesCollection.find(Json.obj("id" -> id)).cursor[BlogEntry].toList
          blogEntriesF.map {blogEntries => { 
    		val blogEntry = blogEntries.head
    		request.headers.get("user-agent").getOrElse("").contains("facebookexternalhit") match {
    		  case true => Ok(views.html.facebook_blogentry(blogEntry)) 
    		  case false => Redirect("http://" + request.host + "/#blog/" + id)
    		}
    	  }
      }
    }
  }
  
  def getBlogEntryById(id: String) = Action { implicit request =>
    
    Async {
      
      for {
        tmp <- {
        	val selector = Json.obj("id" -> id)
        	val modifier = Json.obj("$inc" -> Json.obj("stats.views" -> 1))
			Application.blogEntriesCollection.update(selector, modifier)
        }
        result <- {
          val blogEntriesF = getBlogEntries("id", id)
          blogEntriesF.map {blogEntries => { 
    		val blogEntry = blogEntries.head
    		Ok(Json.toJson(blogEntry))
    	  }
        } 
      }	
    } yield {
      result
    }
  }
 }
  
  def getBlogEntriesByUserId(id: String) = Action { implicit request =>
    
     Async {
    	val blogEntriesF = getBlogEntries("userid", id)
    	blogEntriesF.map {blogEntries => Ok(Json.toJson(blogEntries))}
    }
  }
	
}