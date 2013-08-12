define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/user/UserInputView',
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
	
	login: function(e) {
		this.model.save({id: undefined}, {
			success: function (model, response) {
				window.location.hash = '#';
			},
			error: function (model, response) {
				//alert("Something went wrong -:(. Please try again.");
			}
		});
		return false;  
	}

  });

  return UserLoginView;
  
});