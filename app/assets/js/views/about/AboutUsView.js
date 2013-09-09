define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/BaseView',
  'text!templates/about/aboutUsTemplate.html'
], function($, _, Backbone, Bootstrap, BaseView, aboutUsTemplate){

  var AboutUsView = BaseView.extend({
    //el: $("#body-container"),
	
    initialize: function() {
		BaseView.prototype.initialize.apply();
    },

    render: function(){
		var compiledTemplate = _.template(aboutUsTemplate);
		this.$el.html(compiledTemplate);
		$('#body-container').html(this.el);
		return this;
    }

  });

  return AboutUsView;
  
});