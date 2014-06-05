package models

import play.api.libs.json._
import play.api.libs.functional.syntax._
import org.joda.time.DateTime


case class BlogEntry(
		id: String, 
		name: String,
		coverPhoto: S3Photo,
		shortDesc: String, 
		created: DateTime, 
		by: String, 
		userid: String,
		paragraphs: Seq[String],
		source: String,
		tags: Seq[String],
		stats: Stats,
		draft: String)

object BlogEntry extends Function12[String, String, S3Photo, String, DateTime, String, String, Seq[String], String, Seq[String], Stats, String, BlogEntry] {
	implicit val recipeWrites = Json.writes[BlogEntry]
	implicit val recipeReads = Json.reads[BlogEntry]
}

