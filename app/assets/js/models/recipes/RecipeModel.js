define([
  'backbone'
], function(Backbone) {

	var RecipeModel = Backbone.Model.extend({
	
		initialize: function(options) {
			this.value = options.value;
  		},
		url : function() {
			return '/api/0.1/recipe/'+this.id;
	    }
    });

  	return RecipeModel;

});