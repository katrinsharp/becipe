package controllers

import utils.{Disqus}
import play.api._
import play.api.mvc._
import auth.Authenticated
import play.api.libs.json.Json

object DisqusController extends Controller {
	
	/**
   * TODO:
   * 1. Navigate to comment on the page
   * 2. Logout from disqus redirects to home page right now - only from 3rd party providers
   */
  def getRecipeById(id: String) = Action { implicit request =>
     Redirect("http://" + request.host + "/#recipe/" + id)
  }
  
  def getBlogEntryById(id: String) = Action { implicit request =>
     Redirect("http://" + request.host + "/#blog/" + id)
  }
  
  def login = Authenticated.auth { implicit request =>
 
    val (msg, pk) = Disqus.getMessage(request.user)
    val res = Json.obj("message" -> msg, "pk" -> pk)
    Ok(res)
  }

}