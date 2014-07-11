define([
  'backbone',
  'models/UserInputBaseModel'
], function(Backbone, UserInputBaseModel) {

	var EmailModel = UserInputBaseModel.extend({

		defaults: function() {
			return {
				subject: "",
				message: "",
				em: ""
			};
		},
		url: function() {
			return '/api/0.1/email/add';
		}
	});
		
	return EmailModel;

});