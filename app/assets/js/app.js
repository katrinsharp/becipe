define([
  'jquery', 
  'underscore', 
  'backbone',
  'router',
  'module',
  'globals',
  'views/user/UserLoginView'
], function($, _, Backbone, router, module, globals, UserLoginView){

	var initialize = function(){
		globals.initialize();
		router.initialize();
		UserLoginView.model.set({token: module.config().token, fn: module.config().fn});
	};

	return { 
		initialize: initialize
	};
});