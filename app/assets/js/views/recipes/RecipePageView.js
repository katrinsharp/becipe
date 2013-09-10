define([
  'backbone',
  'views/BaseView',
  'models/recipes/RecipeModel',
  'text!templates/recipes/recipePageTemplate.html'
], function(Backbone, BaseView, RecipeModel, recipePageTemplate){

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
		var recipe = view.model.attributes;
        this.model.fetch({success: function(){
			view.$el.html(compiledTemplate({recipe: recipe}));
			$('#body-container').html(view.el);
			$('.flexslider').flexslider({
				animation: "slide",
				slideshow: false,
				directionNav: true
			});
        }});
		return this;
	}

  });

  return RecipePageView;
  
});