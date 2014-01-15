define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'text!templates/header/mainLinksTemplate.html'
], function($, _, Backbone, Bootstrap, mainLinksTemplate){

  var MainLinksView = Backbone.View.extend({
    
	el: $(".main-links"),
	selector: ".main-links",
	
	events: {
		'click ul.main-links > li > a': 'toggleMobileMenu'
	},
	
	toggleMobileMenu : function() {
		$('.row-offcanvas').toggleClass('active');
	},
	
    initialize: function() {
    },

    render: function(){
		var compiledTemplate = _.template(mainLinksTemplate);
		this.$el.html(compiledTemplate);
		return this;
    }

  });

  return MainLinksView;
  
});