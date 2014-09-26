define([
  'backbone',
  'moment',
  'globals',
  'models/UserInputBaseModel'
], function(Backbone, moment, globals, UserInputBaseModel) {

	var RecipeFormModel = UserInputBaseModel.extend({

		defaults: function() {
			return {
				filesChanged: 0,
				id: undefined,
				by: "",
				draft: "t",
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
				tags: "",
				categories: "",
				subsType: ""
			};
		},
		urlRoot: function() {
			return '/api/0.1/recipe';
		},
		initialize: function() {
			_.extend(this.attributes, globals.recipeHelpers);
		},		
		parse: function(response) {
			if(response.created!=undefined) response.created = moment(response.created).format();
			if(response.ingredients!=undefined) response.ingredients = response.ingredients.join("\n");
			if(response.tags!=undefined) response.tags = response.tags.join(",");
			if(response.categories!=undefined) response.categories = response.categories.join(",");
			return response;
		}
	});
		
	return RecipeFormModel;

});