package models

import play.api.libs.json.Json

case class Category(id: String, desc: String, state: Boolean = false)

object Category extends Function3[String, String, Boolean, Category] {
	implicit val recipeWrites = Json.writes[Category]
	implicit val recipeReads = Json.reads[Category]
}