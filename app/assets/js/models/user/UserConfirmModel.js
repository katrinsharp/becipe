define([
  'backbone',
  'models/UserInputBaseModel'
], function(Backbone, UserInputBaseModel) {

	var UserConfirmModel = UserInputBaseModel.extend({

		defaults: function() {
			return {
				fn: "",
				ln: "",
				em: "",
				ps: "",
				reps: ""
			};
		},
		serverDefaults: function() {
			return {
				fn: "firstName",
				ln: "lastName",
				em: "email",
				ps: "password",
				reps: "repassword"
			};
		},
		initialize: function(options) {
			this.token = options.token;
		},
		url: function() {
			return '/api/0.1/signup/token/' + this.token;
		},
		parse : function(response){
			var that = this;
			return _.object(
						_.keys(that.defaults()), 
						_.map(that.serverDefaults(), function(prop){
															if(response.hasOwnProperty(prop)) {
																return response[prop]
															} 
															else{
																return that.attributes[_.invert(that.serverDefaults())[prop]];
															}}));  
		}    
	});
		
	return UserConfirmModel;

});	