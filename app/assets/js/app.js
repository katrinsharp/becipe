define([
  'jquery', 
  'underscore', 
  'backbone',
  'router'
], function($, _, Backbone, Router){

	define(['module'], function (module) {
		var recipes = new Backbone.Collection( module.config().recipes );
	});
	
	var initialize = function(){
		Router.initialize();
	};

	return { 
		initialize: initialize
	};
});