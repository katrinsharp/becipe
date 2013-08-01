define([
  'jquery',
  'underscore',
  'backbone',
  'cookie'
], function($, _, Backbone, Cookie){

  var BaseView = Backbone.View.extend({
	
    initialize: function() {
		if(typeof ga == 'function') {
			var pathWithHash = (location.pathname + location.hash).replace('#', '');
			console.log(pathWithHash);
		  	ga('send', 'pageview', pathWithHash);
		}
    }
  });

  return BaseView;
  
});