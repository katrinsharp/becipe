define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'collections/filters/RecipesFiltersCollection',
  'text!templates/misc/checkboxTemplate.html'
], function($, _, Backbone, Bootstrap, RecipesFiltersCollection, checkboxTemplate){

  var RecipesFilterView = Backbone.View.extend({
    
	events: {
		//"click label.checkbox": "clickChkbox"
	},

    initialize: function(options) {
		this.model = options.model;
		this.el = options.el;
    },

    render: function(){
	
		var compiledTemplate = _.template(checkboxTemplate);
		this.$el.html(compiledTemplate({id: this.model.get('id'), desc: this.model.get('desc'), state: this.model.get('state')}));
	  
    },
	
	clickChkbox: function() {
		console.log('clickChkbox ' + this.model.get('desc'));
		return true;
	}

  });

  return RecipesFilterView;
  
});