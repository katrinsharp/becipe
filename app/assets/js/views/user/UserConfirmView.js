define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/user/UserInputView',
  'models/user/UserConfirmModel',
  'text!templates/user/userConfirmTemplate.html'
], function($, _, Backbone, Bootstrap, UserInputView, UserConfirmModel, userConfirmTemplate){

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
			UserConfirmView.__super__.el.html("Token is invalid");
        });
        p.done(function () {
			var m = that.model;
			UserConfirmView.__super__.render.call(that, m.attributes);
        });
		
	},
	
	confirm: function(e) {
		this.model.save({ps: this.model.get('ps')}, {
			success: function (model, response) {
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