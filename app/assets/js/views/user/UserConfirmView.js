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
    	this.type = options.type;
		this.model = new UserConfirmModel({token: options.token, type: options.type}),
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
		var that = this;
		this.model.save({ps: this.model.get('ps')}, {
			success: function (model, response) {
				if(that.type == "signup") {
					UserLoginModel.set({token: response['token'], fn: response['fn'], userid: response['userid'], rfavs: []});
					window.location.hash = 'user-signup-complete/'+ model.get('fn');
				} else if(that.type == "resetpassw") {
					window.location.hash = 'user-reset-password-complete/'+ model.get('fn');
				} else //error!!
					window.location.hash = '';
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