package models

import play.api.libs.json._
import play.api.libs.functional.syntax._
import java.util.Date
import org.joda.time.DateTime


case class Signup(
		firstName: String, 
		lastName: String, 
		email: String,
		response: String,
		token: String,
		created: DateTime)

object Signup extends Function6[String, String, String, String, String, DateTime, Signup] {
	implicit val writes = Json.writes[Signup]
	implicit val reads = Json.reads[Signup]
}
