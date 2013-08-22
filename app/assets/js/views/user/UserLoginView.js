define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/UserInputView',
  'models/user/UserLoginModel',
  'text!templates/user/userLoginTemplate.html'
], function($, _, Backbone, Bootstrap, UserInputView, UserLoginModel, userLoginTemplate){

   var UserLoginView = UserInputView.extend({
   
   model: new UserLoginModel(),
   template: userLoginTemplate,
	
	events: {
		"click #login": "login"
	},
	
    initialize: function() {
		UserInputView.prototype.initialize.apply();
		this.events = _.extend({}, UserInputView.prototype.events, this.events);
    },
	
	login: function() {
		this.model.save({id: undefined}, {
			success: function (model, response) {
				model.set({token: response['token'], fn: response['fn']});
				window.location.hash = '#';
			},
			error: function (model, response) {
				//alert("Something went wrong -:(. Please try again.");
			}
		});
		return false;  
	},
	
	logout: function() {
		var that = this;
		$.ajax("/api/0.1/logout", {
			type: "POST",
			success: function() {
				that.model.clear();
				window.location.hash = '#';
			},
			error: function() {
				alert("Something really spooky happened");
		   }
		});
	}
	
  });
  
  return new UserLoginView();
  
});