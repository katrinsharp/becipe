define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'globals',
  'text!templates/social/socialSiteTemplate.html'
], function($, _, Backbone, Bootstrap, globals, socialSiteTemplate){

  var SocialSiteView = Backbone.View.extend({
    el: $(".social-site"),
	selector: ".social-site",
	
	events: {
		"click a[href=gplus]": "gplusClick",
		"click a[href=fb]": "fbClick",
		"click a[href=tw]": "twClick",
		"click a[href=pin]": "pinClick",
		"click a[href=in]": "inClick"
		
	},

    initialize: function() {
		this.render();
    },

    render: function(){
		var compiledTemplate = _.template(socialSiteTemplate);
		this.$el.html(compiledTemplate);
		return this;
    },
	
	gplusClick: function(e) {
		console.log('gplusClick');
		return false;
	},
	fbClick: function(e) {
		console.log('fbClick');
		globals.socialHelpers.bindtoFacebookFollowClick(e);
		return false;
	},
	twClick: function(e) {
		console.log('twClick');
		globals.socialHelpers.bindtoTwitterFollowClick(e);
		return false;
	},
	pinClick: function(e) {
		console.log('pinClick');
		globals.socialHelpers.bindtoPinterestFollowClick(e);
		return false;
	},
	inClick: function(e) {
		console.log('inClick');
		globals.socialHelpers.bindtoLinkedInFollowClick(e);
		return false;
	}
	

  });

  return SocialSiteView;
  
});