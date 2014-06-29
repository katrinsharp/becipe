define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/BaseView',
  'text!templates/about/comingSoonTemplate.html'
], function($, _, Backbone, Bootstrap, BaseView, comingSoonTemplate){

  var ComingSoonView = BaseView.extend({
    //el: $("#body-container"),
	
    initialize: function() {
		BaseView.prototype.initialize.apply();
    },

    render: function(){
		var compiledTemplate = _.template(comingSoonTemplate);
		this.$el.html(compiledTemplate);
		$('#body-container').html(this.el);
		return this;
    }

  });

  return ComingSoonView;
  
});