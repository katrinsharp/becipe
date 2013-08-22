define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/UserInputView',
  'models/user/UserSignupModel',
  'text!templates/user/userSignupTemplate.html'
], function($, _, Backbone, Bootstrap, UserInputView, UserSignupModel, userSignupTemplate){

   var UserSignupView = UserInputView.extend({
   
   model: new UserSignupModel(),
   template: userSignupTemplate,
	
	events: {
		"click #signup": "signup"
	},
	
    initialize: function() {
		UserInputView.prototype.initialize.apply();
		this.events = _.extend({}, UserInputView.prototype.events, this.events);
    },
	
	signup: function(e) {
		this.model.save({id: undefined}, {
			success: function (model, response) {
				window.location.hash = 'user-signup-thankyou/'+ model.get('fn');
			},
			error: function (model, response) {
				//alert("Something went wrong -:(. Please try again.");
			}
		});
		return false;  
	}

  });

  return UserSignupView;
  
});