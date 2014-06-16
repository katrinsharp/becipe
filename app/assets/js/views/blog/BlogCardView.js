define([
  'backbone',
  'views/BaseView',
  'models/user/UserLoginModel',
  'text!templates/blog/blogCardTemplate.html'
], function(Backbone, BaseView, UserLoginModel, blogCardTemplate){

  var BlogCardView = BaseView.extend({
  
	selector: $(".blogcard"),
	
	events: {
		'click a[href="#blogcard-like"]': 'likeIt'
	},
    
    initialize: function(options) {
		this.attributes = options;
    },
	
    render: function() {
		var compiledTemplate = _.template(blogCardTemplate);
		this.$el.html(compiledTemplate({blogEntry: this.attributes}));
		return this;
	},
	
	setNewState: function(newState) {
		var view = this;
		view.attributes.isLiked = newState;
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
			var newState = !this.attributes.isLiked;
			view.setNewState(newState);
			$.ajax("/api/0.1/user/blog/like", {
			type: "PUT",
			data: $.param({id: this.attributes.id, toLike: newState}),
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
  
  return BlogCardView;
  
});