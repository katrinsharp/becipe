define([
  'jquery', 
  'underscore', 
  'backbone',
  'router',
  'module',
  'globals',
  'auth',
  'models/user/UserLoginModel'
], function($, _, Backbone, router, module, globals, auth, UserLoginModel){

	var initialize = function(){
		globals.initialize();
		router.initialize();
		if(module.config().token!="") {	
			UserLoginModel.set({token: module.config().token, fn: module.config().fn});
		}
	};

	return { 
		initialize: initialize
	};
});