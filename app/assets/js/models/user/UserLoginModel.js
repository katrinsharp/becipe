define([
  'backbone',
  'models/UserInputBaseModel'
], function(Backbone, UserInputBaseModel) {

	var UserLoginModel = UserInputBaseModel.extend({

		defaults: function() {
			return {
				em: "",
				ps: ""
			};
		},
		url: function() {
			return '/api/0.1/login';
		},
		isAuthenticated: function() {
			return ((this.get('token')!=undefined)&&(this.get('token')!=""));
		}
	});
		
	return new UserLoginModel();

});	