define([
  'backbone',
  'views/BaseView',
  'views/DisqusView',
  'collections/filters/RecipesFiltersCollection',
  'models/recipes/RecipeModel',
  'text!templates/recipes/recipePageTemplate.html'
], function(Backbone, BaseView, DisqusView, RecipesFiltersCollection, RecipeModel, recipePageTemplate){
  
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
									view.displayErrorPage("no such recipe");
								}
							), 
			new RecipesFiltersCollection().fetch().error(
								function () {
									view.displayErrorPage("Internal error: no such recipe filters");
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
				/*disqus*/
				var identifier = view.model.get('id');
				var url = location.origin + location.pathname + 'disqus/' + location.hash.substr(1, location.hash.length - 1);
				var title = view.model.get('name');
				view.disqusView = new DisqusView({identifier: identifier, url: url, title: title});
				view.disqusView.render();
				/*end of disqus*/
			});	
			
		return this;
	}

  });

  return RecipePageView;
  
});