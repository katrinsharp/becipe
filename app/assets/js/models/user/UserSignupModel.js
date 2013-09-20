define([
  'backbone',
  'models/UserInputBaseModel'
], function(Backbone, UserInputBaseModel) {

	var UserSignupModel = UserInputBaseModel.extend({

		defaults: function() {
			return {
				fn: "",
				ln: "",
				em: ""
			};
		},
		url: function() {
			return '/api/0.1/signup/add';
		}
	});
		
	return UserSignupModel;

});	