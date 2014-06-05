define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'flexslider',
  'models/user/UserLoginModel',
  'views/BaseView',
  'text!templates/home/homeTemplate.html'
], function($, _, Backbone, Bootstrap, Flexslider, UserLoginModel, BaseView, homeTemplate){

  var HomeView = BaseView.extend({
    
	//el: "#body-container",

    initialize: function(options) {
		BaseView.prototype.initialize.apply();
    },

    render: function(){
		var compiledTemplate = _.template(homeTemplate);
		this.$el.html(compiledTemplate);
		$('#body-container').html(this.el);
		var $container = $('#filter-container');	
		
		$('.flexslider-recent').flexslider({
			animation:		"fade",
			animationSpeed:	1000,
			controlNav:		true,
			directionNav:	false
		});
		$('.flexslider-testimonial').flexslider({
			animation: 		"fade",
			slideshowSpeed:	5000,
			animationSpeed:	1000,
			controlNav:		true,
			directionNav:	false
		});
		
		return this;
    },
	
	close: function() {
		this.remove();
	}
	
  });

  return HomeView;
  
});