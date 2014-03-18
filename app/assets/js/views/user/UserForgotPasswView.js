define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/UserInputView',
  'text!templates/user/userForgotPasswordTemplate.html'
], function($, _, Backbone, Bootstrap, UserInputView, userForgotPasswordTemplate){

   var UserForgotPasswView = UserInputView.extend({
   
   template: userForgotPasswordTemplate,
	
	events: {
		"click #resetPassword": "resetPassword"
	},
	
    initialize: function(options) {
		UserInputView.prototype.initialize.apply();
		this.events = _.extend({}, UserForgotPasswView.prototype.events, this.events);
    },
	
	render: function(options) {
		UserForgotPasswView.__super__.render.call(this, {});
		return this;
	},
		
	resetPassword: function() {
		var form = this.$('form');
		$(form).ajaxSubmit({
			url: "api/0.1/forgotPassword",
			success: function(response) {
				window.location.hash = 'user-reset-password-checkyouremail/Becipe member';
			},
			error: function(jqXHR, textStatus, errorThrown) {
			}
		});
		return false;
	}
	
  });
  
  return UserForgotPasswView;
  
});