package models

import play.api.libs.json._
import play.api.libs.functional.syntax._
import java.util.Date
import org.joda.time.DateTime


case class User(
		id: String,
		firstName: String, 
		lastName: String, 
		email: String,
		recipes: Option[Set[String]],
		rfavs: Option[Set[String]],
		created: DateTime)

object User extends Function7[String, String, String, String, Option[Set[String]], Option[Set[String]], DateTime, User] {
	implicit val writes = Json.writes[User]
	implicit val reads = Json.reads[User]
}
