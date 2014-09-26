package models

import play.api.libs.json._
import play.api.libs.functional.syntax._
import org.joda.time.DateTime

case class NewRecipe( 
		id: String, 
		name: String, 
		shortDesc: String, 
		created: DateTime, 
		directions: String, 
		ingredients: Seq[String],
		prepTime: String,
		readyIn: Option[String],
		recipeYield: String,
		supply: Option[String],
		level: String, 
		tags: Seq[String],
		categories: Seq[String],
		draft: String,
		subsType: String)

/*
 * TODO:
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
		prepTime: String,
		readyIn: Option[String],
		recipeYield: String,
		supply: Option[String],
		level: String, 
		tags: Seq[String],
		categories: Seq[String],
		stats: Stats,
		draft: String,
		photos: Seq[S3Photo],
		subsType: Option[String])

object Recipe extends Function19[String, String, String, DateTime, String, String, String, Seq[String], String, Option[String], String, Option[String],String, Seq[String], Seq[String], Stats, String, Seq[S3Photo], Option[String], Recipe] {
	implicit val recipeWrites = Json.writes[Recipe]
	implicit val recipeReads = Json.reads[Recipe]
	implicit def NewRecipe2Recipe(newRecipe: NewRecipe) = Recipe(
      id = newRecipe.id,
      name = newRecipe.name,
      shortDesc = newRecipe.shortDesc,
      created = newRecipe.created,
      by = "",
      userid = "",
      directions = newRecipe.directions,
      ingredients  = newRecipe.ingredients,
      prepTime  = newRecipe.prepTime,
      readyIn = newRecipe.readyIn,
      recipeYield  = newRecipe.recipeYield,
      supply = newRecipe.supply,
      level = newRecipe.level,
      tags = newRecipe.tags,
      categories = newRecipe.categories,
      stats = new Stats,
      draft = newRecipe.draft,
      photos = Seq[S3Photo](),
      subsType = Some(newRecipe.subsType))
}

