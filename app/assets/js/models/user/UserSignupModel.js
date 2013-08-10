define([
  'backbone',
  'models/user/UserInputBaseModel'
], function(Backbone, UserInputBaseModel) {

	var UserSignupModel = UserInputBaseModel.extend({

		defaults: function() {
			return {
				fn: "First Name",
				ln: "Last Name",
				em: "Email Address"
			};
		},
		url: function() {
			return '/api/0.1/signup/add';
		}
	});
		
	return UserSignupModel;

});	