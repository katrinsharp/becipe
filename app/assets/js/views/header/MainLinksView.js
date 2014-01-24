define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'Events',
  'text!templates/header/mainLinksTemplate.html'
], function($, _, Backbone, Bootstrap, Events, mainLinksTemplate){

  var MainLinksView = Backbone.View.extend({
    
	el: $(".main-links"),
	selector: ".main-links",
	
	events: {
		'click ul.main-links > li:not(".share") > a': 'closeMobileMenu',
		'click .social-dropdown-menu a': 'onClickSocialButton'
	},
	
	closeMobileMenu : function() {
		this.trigger('closeMobileMenuEvent');
	},
	
    initialize: function() {
    },

    render: function(){
		var compiledTemplate = _.template(mainLinksTemplate);
		this.$el.html(compiledTemplate);
		return this;
    },
	
	onClickSocialButton: function() {
		this.$el.find('li.share a[data-toggle=dropdown]').click();//close the parent social menu
		return false;
	}

  });

  return MainLinksView;
  
});