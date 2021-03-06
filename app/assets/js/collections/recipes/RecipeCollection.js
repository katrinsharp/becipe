define([
  'backbone',
  'models/recipes/RecipeModel'
], function(Backbone, RecipeModel) {
	var RecipeCollection = Backbone.Collection.extend({
		model: RecipeModel,
		url : function() {
			return 'api/0.1/recipes';
	    },
		parse : function(res) {
			return res;
	    }	
	});
	
	return RecipeCollection;

});