define([
  'backbone',
  'moment',
  'models/UserInputBaseModel'
], function(Backbone, moment, UserInputBaseModel) {

	var RecipeFormModel = UserInputBaseModel.extend({

		defaults: function() {
			return {
				recipe_id: "-1",
				recipe_by: "anon",
				recipe_created: moment().format(),
				recipe_name: "xxx",
				recipe_shortDesc: "xxxx",
				recipe_ingredients: "xxx",
				recipe_prepTime: "xxx",
				recipe_readyIn: undefined,
				recipe_recipeYield: "xxx",
				recipe_supply: undefined,
				recipe_directions: "xxxx",
				recipe_level: "beginner",
				recipe_tags: "aaa,yyy,zzz"
			};
		},
		url: function() {
			return '/api/0.1/recipe/add';
		}
	});
		
	return RecipeFormModel;

});