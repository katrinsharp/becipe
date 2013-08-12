define([
  'backbone',
  'models/user/UserInputBaseModel'
], function(Backbone, UserInputBaseModel) {

	var UserLoginModel = UserInputBaseModel.extend({

		defaults: function() {
			return {
				em: "Email Address",
				ps: "Password"
			};
		},
		url: function() {
			return '/api/0.1/login';
		}
	});
		
	return UserLoginModel;

});	