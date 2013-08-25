define([
  'jquery',
  'underscore',
  'backbone',
  'cookie'
], function($, _, Backbone, Cookie){

  var BaseView = Backbone.View.extend({
	
    initialize: function() {
		if(typeof ga == 'function') {
			var signupIter = $.cookie('becipe-signup-iteration');
		  	if(signupIter != undefined) {
		  		console.log('signupIter: ' + signupIter);
		  		ga('set', 'metric1', signupIter);
		  	}
		  	var firstVisit = $.cookie('becipe-first-iteration-visit');
			if(firstVisit != undefined) {
				console.log('firstVisit: ' + firstVisit);
				ga('set', 'metric2', firstVisit);
			}
			var pathWithHash = (location.pathname + location.hash).replace('#', '');
			console.log(pathWithHash);
		  	ga('send', 'pageview', pathWithHash);
		}
    },
	close: function() {
		this.remove();
	}
  });

  return BaseView;
  
});