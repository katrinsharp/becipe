define([
  'backbone',
  'views/BaseView',
  'models/user/UserLoginModel',
  'text!templates/recipes/recipeCardTemplate.html'
], function(Backbone, BaseView, UserLoginModel, recipeCardTemplate){

  var RecipeCardView = BaseView.extend({
  
	selector: "figure.placeholder",
	
	events: {
		'click a[href="#recipe-like"]': 'likeIt'
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
		this.sendGaPageView(e);
		if(UserLoginModel.isAuthenticated()) {
			console.log('like it');	
		} else {
			console.log('login first -- like it');	
		}
		return false;
	}

  });
  
  RecipeCardView.selector = "figure.placeholder";

  return RecipeCardView;
  
});