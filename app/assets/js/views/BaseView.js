define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'text!templates/errorTemplate.html'
], function($, _, Backbone, Cookie, errorTemplate){

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
	displayError: function(errorMsg) {
		var compiledTemplate = _.template(errorTemplate);
		$('#body-container').html(compiledTemplate({errorMsg: errorMsg}));
	},
	close: function() {
		this.remove();
	}
  });

  return BaseView;
  
});