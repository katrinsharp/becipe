define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'flexslider',
   'globals',
  'models/user/UserLoginModel',
  'views/BaseView',
  'text!templates/home/homeTemplate.html',
  'text!templates/recipes/recentRecipesTemplate.html',
  'text!templates/blog/recentBlogEntriesSliderTemplate.html'
], function($, _, Backbone, Bootstrap, Flexslider, globals, UserLoginModel, BaseView, homeTemplate, recentRecipesTemplate, recentBlogEntriesSliderTemplate){

  var HomeView = BaseView.extend({
    
	//el: "#body-container",

    initialize: function(options) {
		BaseView.prototype.initialize.apply();
    },
	
	events: {
		"click a[href=scroll]": "scrollClick"
	},
	
	scrollClick: function(e) {
		e.preventDefault();
		var target = $.find("#scroll");
		var header = $.find(".next-to-header");
		$(document).scrollTop($(target).offset().top - $(header).offset().top);
		return true;
	},

    render: function(){
		
		var view = this;
		
		var compiledTemplate = _.template(homeTemplate);
		this.$el.html(compiledTemplate);
		$('#body-container').html(this.el);
		var $container = $('#filter-container');	
		
		$('.flexslider-testimonial').flexslider({
			animation: 		"fade",
			slideshowSpeed:	5000,
			animationSpeed:	1000,
			controlNav:		true,
			directionNav:	false
		});
		
		$.ajax("/api/0.1/recipe/recent/4", {
			type: "GET",
			success: function(response) {
				var compRecentRecipesTemplate = _.template(recentRecipesTemplate);
				var attrs = {"recipes": response};
				_.extend(attrs, globals.recipeHelpers);
				view.$el.find("#new-recipes").html(compRecentRecipesTemplate(attrs));
			},
			error: function(response) {
				console.log('random recipes: error');
			}
		});
		
		$.ajax("/api/0.1/blog/recent/3", {
			type: "GET",
			success: function(response) {
				var recentBlogEntriesCompiledTemplate = _.template(recentBlogEntriesSliderTemplate);
				view.$el.find("#new-blog-entries").html(recentBlogEntriesCompiledTemplate({"blogEntries": response}));
				$('.flexslider-recent').flexslider({
					animation:		"fade",
					animationSpeed:	1000,
					controlNav:		true,
					directionNav:	false
				});
			},
			error: function(response) {
				console.log('recent blog entries: error');
			}
		});
		
		return this;
    },
	
	close: function() {
		this.remove();
	}
	
  });

  return HomeView;
  
});