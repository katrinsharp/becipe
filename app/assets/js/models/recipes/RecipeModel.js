define([
  'backbone'
], function(Backbone) {

	var RecipeModel = Backbone.Model.extend({
	
		initialize: function(options) {
			this.value = options.value;
  		}
    });

  	return RecipeModel;

});