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
		_.extend(this.model.attributes, {isLiked: options.isLiked});
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
		var view = this;
		if(UserLoginModel.isAuthenticated()) {
			console.log('like it');	
			var newState = !this.model.get('isLiked');
			$.ajax("/api/0.1/user/setLikeRecipe", {
			type: "PUT",
			data: $.param({recipeId: this.model.get('id'), toLike: newState}),
			success: function() {
				console.log('kuku katrin');
				view.model.set('isLiked', newState);
				view.$('.like').toggleClass('is-liked');
			},
			error: function() {
				alert("Something really spooky happened");
		   }
		});
			
			
		} else {
			console.log('login first -- like it');	
		}
		return false;
	}

  });
  
  RecipeCardView.selector = "figure.placeholder";

  return RecipeCardView;
  
});