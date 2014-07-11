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
			this.type = options.type;
		},
		url: function() {
			if(this.type == "signup")
				return '/api/0.1/signup/token/' + this.token;
			else if(this.type == "resetpassw")
				return '/api/0.1/user/token/' + this.token;
			else 
				alert("neither signup nor reset password");
		},
		parse : function(response){
			if(response == null)
				return this;
			
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