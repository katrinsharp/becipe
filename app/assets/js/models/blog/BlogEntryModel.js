define([
  'backbone',
   'moment',
   'globals'
], function(Backbone, Moment, globals) {

	var BlogEntryModel = Backbone.Model.extend({
	
		initialize: function(options) {
			this.value = options.value;
			_.extend(this.attributes, globals.recipeHelpers);
  		},
		url : function() {
			return '/api/0.1/blog/'+this.id;
	    }
    });

  	return BlogEntryModel;

});