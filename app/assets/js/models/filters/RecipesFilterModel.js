define([
  'backbone',
  'models/misc/CheckboxModel'
], function(Backbone, CheckboxModel) {

	var RecipesFilterModel = CheckboxModel.extend({
	
		initialize: function() {
  		},
		url : function() {
			return 'data/recipe.json';//add id to query
	    }
    });

  	return RecipesFilterModel;

});