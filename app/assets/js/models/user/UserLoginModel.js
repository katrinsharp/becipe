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
		initialize: function() {
			this.listenTo(this, 'change:token', this.loginTokenChanged);
		},
		loginTokenChanged: function() {
			var token = this.get('token');
			$.cookie('token', token);
		},
		isAuthenticated: function() {
			return ((this.get('token')!=undefined)&&(this.get('token')!=""));
		}
	});
		
	return new UserLoginModel();

});	