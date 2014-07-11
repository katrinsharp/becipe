define([
  'backbone',
  'globals',
  'views/BaseView',
  'views/DisqusView',
  'collections/filters/RecipesFiltersCollection',
  'models/recipes/RecipeModel',
  'text!templates/recipes/recipePageTemplate.html'
], function(Backbone, globals, BaseView, DisqusView, RecipesFiltersCollection, RecipeModel, recipePageTemplate){
  
	var RecipePageView = BaseView.extend({
  
	//el: $("#body-container"),
	
	events: {
		"click a[href=gplus]": "gplusClick",
		"click a[href=fb]": "fbClick",
		"click a[href=tw]": "twClick",
		"click a[href=pin]": "pinClick"
	},
	
	fbClick: function(e) {
		console.log('fbClick');
		globals.socialHelpers.bindtoFacebookShareClick(e);
		return true;
	},
    
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