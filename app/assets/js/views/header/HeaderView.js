define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'collections/recipes/RecipeCollection',
  'views/social/SocialSiteView',
  'text!templates/header/headerTemplate.html',
  'views/filters/RecipesFiltersView',
  'router'
], function($, _, Backbone, Bootstrap, RecipeCollection, SocialSiteView, headerTemplate, RecipesFiltersView, AppRouter){

  var HeaderView = Backbone.View.extend({
    
	el: $("#header"),
	
	events: {
		'click #search-btn': 'clickSearch'
	},
	
	collection: new RecipeCollection(),
	
    initialize: function() {
    },

    render: function(){
      var compiledTemplate = _.template(headerTemplate);
      this.$el.html(compiledTemplate);
	  this.socialSiteView = new SocialSiteView();
	  this.socialSiteView.setElement(this.$el.find(this.socialSiteView.selector)).render();
	  this.recipesFiltersView = new RecipesFiltersView();
	  this.recipesFiltersView.setElement(this.$el.find(this.recipesFiltersView.selector)).render();
    },
	
	clickSearch: function() {
		window.location="#search-recipes";
	}

  });

  return HeaderView;
  
});