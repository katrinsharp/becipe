define([
  'backbone',
  'text!templates/recipes/recipeCardTemplate.html'
], function(Backbone, recipeCardTemplate){

  var RecipeCardView = Backbone.View.extend({
  
	selector: "figure.placeholder",
	
	events: {
		'click a[href="#like"]': 'likeIt'
	},
    
    initialize: function(options) {
		this.model = options.model;
		this.setElement(options.el);//.render();
    },
	
    render: function() {
		var compiledTemplate = _.template(recipeCardTemplate);
		this.$el.html(compiledTemplate(this.model.attributes));
		return this;
	},
	
	likeIt: function(e) {
		e.preventDefault();
		console.log('like it');
		return false;
	}

  });
  
  RecipeCardView.selector = "figure.placeholder";

  return RecipeCardView;
  
});