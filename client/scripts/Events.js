define([
  'jquery',
  'underscore',	
  'backbone'
], function($, _, Backbone) {
	var Events = _.extend({}, Backbone.Events);
	return Events;
});