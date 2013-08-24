define([
  'jquery', 
  'underscore', 
  'backbone',
  'module'
], function($, _, Backbone, module){

	var initialize = function(){
		this.currentIteration = module.config().currentIteration;
	};

	return { 
		initialize: initialize
	};
});