define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'models/user/UserLoginModel',
  'views/UserInputView',
  'models/user/UserConfirmModel',
  'text!templates/user/userConfirmTemplate.html'
], function($, _, Backbone, Bootstrap, UserLoginModel, UserInputView, UserConfirmModel, userConfirmTemplate){

   var UserConfirmView = UserInputView.extend({
   
   template: userConfirmTemplate,
	
	events: {
		"click #confirm": "confirm"
	},
	
    initialize: function(options) {
		this.model = new UserConfirmModel({token: options.token}),
		UserInputView.prototype.initialize.apply();
		this.events = _.extend({}, UserInputView.prototype.events, this.events);
    },
	
	render: function() {
		var that = this, p;
		p = this.model.fetch();
		p.error(function () {
			that.displayErrorPage("token is invalid");
        });
        p.success(function () {
			var m = that.model;
			UserConfirmView.__super__.render.call(that, m.attributes);
        });
		return this;
	},
	
	confirm: function(e) {
		this.model.save({ps: this.model.get('ps')}, {
			success: function (model, response) {
				UserLoginModel.set({token: response['token'], fn: response['fn']});
				window.location.hash = 'user-signup-complete/'+ model.get('fn');
			},
			error: function (model, response) {
				//alert("Something went wrong -:(. Please try again.");
			}
		});
		return false;  
	}

  });

  return UserConfirmView;
  
});