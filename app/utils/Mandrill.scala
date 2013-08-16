package utils

import play.api.libs.json._
import controllers.Application

object Mandrill {
  
  def createRegistrationConfirmRequest(to: String, baseUrl: String, token: String) = {
    Json.obj(
	"key" -> Application.mandrillApiKey,
	"template_name" -> "userregistrationconfirmationtemplate",
    "message" ->
        Json.obj(
			"to" -> Seq(
				Json.obj("email" -> to)
			),
			"headers" ->  Json.obj("Reply-To"-> "noreply@becipe.com"),
			"tags" -> Seq(
				"registration-confirmation", 
				"iteration-3"),
			"track_opens" -> true, 
			"track_clicks" -> true,
			"global_merge_vars"-> Seq(
				Json.obj("name" -> "BASE_URL", "content" -> baseUrl), 
				Json.obj("name" -> "CONFIRM_TOKEN", "content" -> token)
				)
    	),
	"template_content" -> Seq(
		Json.obj(
			"name" -> "example name",
			"content" -> "example content"			
		)
	)
  )
  }

}