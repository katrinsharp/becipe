define([
  'backbone'
], function(Backbone) {

	var CheckboxModel = Backbone.Model.extend({
	
		el: $('input[type="checkbox"]'),
	
		initialize: function() {
  		},
		url : function() {
			return 'data/recipe.json';//add id to query
	    }
    });

  	return CheckboxModel;

});