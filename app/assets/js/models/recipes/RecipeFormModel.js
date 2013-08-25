define([
  'backbone',
  'moment',
  'models/UserInputBaseModel'
], function(Backbone, moment, UserInputBaseModel) {

	var RecipeFormModel = UserInputBaseModel.extend({

		defaults: function() {
			return {
				id: undefined,
				by: "",
				created: moment().format(),
				name: "xxx",
				shortDesc: "xxxx",
				ingredients: "xxx",
				prepTime: "xxx",
				readyIn: undefined,
				recipeYield: "xxx",
				supply: undefined,
				directions: "xxxx",
				level: "beginner",
				tags: "aaa,yyy,zzz"
			};
		},
		url: function() {
			return '/api/0.1/recipe';
		}
	});
		
	return RecipeFormModel;

});