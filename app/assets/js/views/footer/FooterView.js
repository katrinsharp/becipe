define([
  'jquery',
  'underscore',
  'backbone',
  'globals',
  'text!templates/footer/footerTemplate.html'
], function($, _, Backbone, globals, footerTemplate){

  var FooterView = Backbone.View.extend({
    el: $("#footer"),

    initialize: function() {
		this.categories = globals.categories;
    },

    render: function(){
	
		var compiledTemplate = _.template(footerTemplate);
		var view = this;
		view.$el.html(compiledTemplate({categories: this.categories}));
		return this;
    }

  });

  return FooterView;
  
});