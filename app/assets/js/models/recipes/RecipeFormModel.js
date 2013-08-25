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
				name: "",
				shortDesc: "",
				ingredients: "",
				prepTime: "",
				readyIn: undefined,
				recipeYield: "",
				supply: undefined,
				directions: "",
				level: "beginner",
				tags: ""
			};
		},
		url: function() {
			return '/api/0.1/recipe';
		}
	});
		
	return RecipeFormModel;

});