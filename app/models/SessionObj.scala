package models

import play.api.libs.json._
import play.api.libs.functional.syntax._
import java.util.Date
import org.joda.time.DateTime
import java.util.UUID


case class SessionObj(
    token: String = UUID.randomUUID().toString(),
	fn: String,
	userid: String,
	rfavs: Set[String]
  ) {
  //def toMap = Map("token" -> token, "fn" -> fn, "userid" -> userid, "rfavs" -> Json.toJson(Json.obj("rfavs" -> rfavs)).toString)
}

object SessionObj extends Function4[String, String, String, Set[String], SessionObj] {
	implicit val writes = Json.writes[SessionObj]
	implicit val reads = Json.reads[SessionObj]
}
