define([
  'backbone',
  'moment',
  'views/BaseView',
  'models/recipes/RecipeModel',
  'text!templates/recipes/recipePageTemplate.html'
], function(Backbone, Moment, BaseView, RecipeModel, recipePageTemplate){

	var viewHelpers = {
		date: function(time){
			var date = moment(time).format('LL');
			return date;
		}
	}

  var RecipePageView = BaseView.extend({
  
	el: $("#body-container"),
    
    initialize: function(options) {
		this.model = new RecipeModel(options);
		BaseView.prototype.initialize.apply();
    },

    render: function() {
		console.log('recipe page view render: '+ this.model.id);
		var compiledTemplate = _.template(recipePageTemplate);
		var view = this;
		var recipe = view.model.attributes;
		_.extend(recipe, viewHelpers);
        this.model.fetch({success: function(){
			view.$el.html(compiledTemplate({recipe: recipe}));
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