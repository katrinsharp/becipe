define([
  'jquery', 
  'underscore', 
  'backbone',
  'router',
  'module',
  'globals',
  'auth',
  'views/user/UserLoginView'
], function($, _, Backbone, router, module, globals, auth, UserLoginView){

	var initialize = function(){
		globals.initialize();
		router.initialize();
		if(module.config().token!="") {	
			UserLoginView.model.set({token: module.config().token, fn: module.config().fn});
		}
	};

	return { 
		initialize: initialize
	};
});