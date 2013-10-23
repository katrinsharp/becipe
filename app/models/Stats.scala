package models

import play.api.libs.json._
import play.api.libs.functional.syntax._
import org.joda.time.DateTime


case class Stats(
		likes: Int = 0,
		rating: Int = 0)

object Stats extends Function2[Int, Int, Stats] {
	implicit val writes = Json.writes[Stats]
	implicit val reads = Json.reads[Stats]
}
