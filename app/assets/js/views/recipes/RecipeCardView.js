define([
  'backbone',
  'views/BaseView',
  'models/user/UserLoginModel',
  'text!templates/recipes/recipeCardTemplate.html'
], function(Backbone, BaseView, UserLoginModel, recipeCardTemplate){

  var RecipeCardView = BaseView.extend({
  
	selector: "figure.placeholder",
	
	events: {
		'click a[href="#recipe-like"]': 'likeIt',
		'click a.click2Recipe': 'clickRecipe'
	},
    
    initialize: function(options) {
		this.model = options.model;
		_.extend(this.model.attributes, {isLiked: options.isLiked});
		if(this.model.attributes.subsType==undefined) {
			_.extend(this.model.attributes, {subsType: 'free'});
		} else if(this.model.attributes.subsType=='paid') {
			this.model.attributes.subsType = 'premium';
		}
		this.setElement(options.el);//.render();
    },
	
    render: function() {
		var compiledTemplate = _.template(recipeCardTemplate);
		this.$el.html(compiledTemplate(this.model.attributes));
		return this;
	},
	
	clickRecipe: function() {
		UserLoginModel.currentRecipeSubsType = this.model.attributes.subsType;
	},
	
	setNewState: function(newState) {
		var view = this;
		view.model.set('isLiked', newState);
		view.$('.like').toggleClass('is-liked');
		var likes = parseInt(view.$('.stats.likes').text());
		likes = (newState == true ? likes + 1: likes - 1);
		view.$('.stats.likes').text(likes);
	},
	
	reverseState: function(newState) {
		setNewState(!newState);
	},
	
	likeIt: function(e) {
		e.preventDefault();
		this.sendGaPageView(e);
		var view = this;
		if(UserLoginModel.isAuthenticated()) {
			var newState = !this.model.get('isLiked');
			view.setNewState(newState);
			$.ajax("/api/0.1/user/setLikeRecipe", {
			type: "PUT",
			data: $.param({recipeId: this.model.get('id'), toLike: newState}),
			success: function() {
			},
			error: function() {
				view.reverseState(newState);
		   }
		});
		
		} else {
			console.log('login first -- like it');	
			alert("Please login/signup first");
		}
		return false;
	}

  });
  
  RecipeCardView.selector = "figure.placeholder";

  return RecipeCardView;
  
});