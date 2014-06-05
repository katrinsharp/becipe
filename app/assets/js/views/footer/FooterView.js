define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/footer/footerTemplate.html'
], function($, _, Backbone, footerTemplate){

  var FooterView = Backbone.View.extend({
    el: $("#footer"),

    initialize: function() {
    },

    render: function(){
	
		var compiledTemplate = _.template(footerTemplate);
		var view = this;
		view.$el.html(compiledTemplate());
		return this;
    }

  });

  return FooterView;
  
});