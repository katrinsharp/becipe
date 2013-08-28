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
		urlRoot: function() {
			return '/api/0.1/recipe';
		},
		//model.save() 
		parse: function(response) {
			if(response.created!=undefined) response.created = moment(response.created).format();
			if(response.ingredients!=undefined) response.ingredients = response.ingredients.join(",");
			if(response.tags!=undefined) response.tags = response.tags.join(",");
			return response;
		}
	});
		
	return RecipeFormModel;

});