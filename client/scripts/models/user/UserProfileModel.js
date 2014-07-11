define([
  'backbone',
  'models/UserInputBaseModel'
], function(Backbone, UserInputBaseModel) {

	var UserProfileModel = UserInputBaseModel.extend({

		initialize: function(options) {
			this.id = options.id;
		},
		url: function() {
			return '/api/0.1/user/' + this.id;
		} 
	});
		
	return UserProfileModel;

});	