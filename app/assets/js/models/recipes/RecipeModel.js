define([
  'backbone'
], function(Backbone) {

	var RecipeModel = Backbone.Model.extend({
	
		initialize: function() {
  		},
		url : function() {
			return 'data/recipe.json';//add id to query
	    }
    });

  	return RecipeModel;

});