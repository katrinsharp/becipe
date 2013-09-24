package models

import play.api.libs.json._
import play.api.libs.functional.syntax._
import java.util.Date
import org.joda.time.DateTime


object StatusVal extends Enumeration {
    type StatusVal = Value
    val error, success, inprogress = Value
  }

case class Error(name: String, message: String)

object Error extends Function2[String, String, Error] {
	implicit val writes = Json.writes[Error]
	implicit val reads = Json.reads[Error]
}

case class Success(name: String, src: S3Photo)

object Success extends Function2[String, S3Photo, Success] {
	implicit val writes = Json.writes[Success]
	implicit val reads = Json.reads[Success]
}

case class RequestState(
		requestHandle: String,
		status: String, 
		processed: Option[Int] = None,
		total: Option[Int] = None,
		error: Option[String] = None,
		errors: Option[Seq[Error]] = None, 
		successes: Option[Seq[Success]] = None)

object RequestState extends Function7[String, String, Option[Int], Option[Int], Option[String], Option[Seq[Error]], Option[Seq[Success]], RequestState] {
	implicit val writes = Json.writes[RequestState]
	implicit val reads = Json.reads[RequestState]
}
