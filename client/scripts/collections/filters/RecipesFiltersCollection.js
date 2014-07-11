define([
  'backbone',
  'collections/misc/CheckboxCollection',
  'models/filters/RecipesFilterModel'
], function(Backbone, CheckboxCollection, RecipesFilterModel) {
	var RecipesFiltersCollection = CheckboxCollection.extend({
		model: RecipesFilterModel,
		url : function() {
			return 'data/recipesfilters.json';
	    },
		parse : function(res) {
			return res;
	    }	
	});
	
	return RecipesFiltersCollection;

});