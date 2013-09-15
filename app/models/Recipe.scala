package models

import play.api.libs.json._
import play.api.libs.functional.syntax._
import java.util.Date
import org.joda.time.DateTime

/*
 * TODO: add userId of who created it?
 * Don't forget there is a discrepancy with 
 	submit - new filed rating
 */
case class Recipe(
		id: String, 
		name: String, 
		shortDesc: String, 
		created: DateTime, 
		by: String, 
		userid: String,
		directions: String, 
		ingredients: Seq[String],
		phases: Seq[RecipePhase],
		prepTime: String,
		readyIn: Option[String],
		recipeYield: String,
		supply: Option[String],
		level: String, 
		tags: Seq[String],
		rating: Int,
		draft: String,
		photos: Seq[S3Photo])

object Recipe extends Function18[String, String, String, DateTime, String, String, String, Seq[String], Seq[RecipePhase], String, Option[String], String, Option[String],String, Seq[String], Int, String, Seq[S3Photo], Recipe] {
	implicit val recipeWrites = Json.writes[Recipe]
	implicit val recipeReads = Json.reads[Recipe]
}
