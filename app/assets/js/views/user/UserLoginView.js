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
   
   model: UserLoginModel,
   template: userLoginTemplate,
	
	events: {
		"click #login": "login"
	},
	
    initialize: function() {
		UserInputView.prototype.initialize.apply();
		this.events = _.extend({}, UserInputView.prototype.events, this.events);
		this.listenTo(this.model, 'change:token', this.loginTokenChanged);
    },
	
	render: function(options) {
		if(options!=undefined) {
			this.backUrl = options.backUrl;
		}
		UserLoginView.__super__.render.call(this, {});
		return this;
	},

	loginTokenChanged: function() {
		var token = this.model.get('token');
		$.cookie('token', token);
	},
		
	login: function() {
		var view = this;
		this.model.save({id: undefined}, {
			success: function (model, response) {
				model.set({token: response['token'], fn: response['fn']});
				window.location.hash = view.backUrl==null?'':view.backUrl;
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
				//that.model.clear();
				_.each(_.keys(that.model.attributes), function(key){that.model.set(key, "")});
				window.location.hash = '';
			},
			error: function() {
				alert("Something really spooky happened");
		   }
		});
	}
	
  });
  
  return UserLoginView;
  
});