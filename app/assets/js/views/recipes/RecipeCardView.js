define([
  'backbone',
  'text!templates/recipes/recipeCardTemplate.html'
], function(Backbone, recipeCardTemplate){

  var RecipeCardView = Backbone.View.extend({
  
	selector: "figure.placeholder",
    
    initialize: function(options) {
		this.model = options.model;
		this.setElement(options.el);//.render();
    },

    render: function() {
		var compiledTemplate = _.template(recipeCardTemplate);
		this.$el.html(compiledTemplate({recipe: this.model.attributes}));
		//return this;
	}

  });
  
  RecipeCardView.selector = "figure.placeholder";

  return RecipeCardView;
  
});