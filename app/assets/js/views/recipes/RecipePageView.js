define([
  'backbone',
  'views/BaseView',
  'collections/filters/RecipesFiltersCollection',
  'models/recipes/RecipeModel',
  'text!templates/recipes/recipePageTemplate.html'
], function(Backbone, BaseView, RecipesFiltersCollection, RecipeModel, recipePageTemplate){

  var RecipePageView = BaseView.extend({
  
	//el: $("#body-container"),
    
    initialize: function(options) {
		this.model = new RecipeModel(options);
		BaseView.prototype.initialize.apply();
    },

    render: function() {
		console.log('recipe page view render: '+ this.model.id);
		var compiledTemplate = _.template(recipePageTemplate);
		var view = this;
	
		$.when(
			this.model.fetch().error(
								function () {
									that.displayErrorPage("no such recipe");
								}
							), 
			new RecipesFiltersCollection().fetch().error(
								function () {
									that.displayErrorPage("Internal error: no such recipe filters");
								}
							)
			).then(function(modelR, recipeFiltersR){
				var recipeFilters = recipeFiltersR[0];
				var attributes = _.extend(view.model.attributes, {recipeFilters: recipeFilters});
				view.$el.html(compiledTemplate({recipe: attributes}));
				$('#body-container').html(view.el);
				$('.flexslider').flexslider({
					animation: "slide",
					slideshow: false,
					directionNav: true
				});
			});
			
		return this;
	}

  });

  return RecipePageView;
  
});