define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/social/SocialSiteView',
  'text!templates/header/headerTemplate.html',
  'views/filters/RecipesFiltersView'
], function($, _, Backbone, Bootstrap, SocialSiteView, headerTemplate, RecipesFiltersView){

  var HeaderView = Backbone.View.extend({
    
	el: $("#header"),
	
    initialize: function() {
		this.render();
    },

    render: function(){
      var compiledTemplate = _.template(headerTemplate);
      this.$el.html(compiledTemplate);
	  this.socialSiteView = new SocialSiteView();
	  this.socialSiteView.setElement(this.$el.find(this.socialSiteView.selector)).render();
	  this.recipesFiltersView = new RecipesFiltersView();
	  this.recipesFiltersView.setElement(this.$el.find(this.recipesFiltersView.selector)).render();
	  
    }

  });

  return HeaderView;
  
});