define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'text!templates/social/socialSiteTemplate.html'
], function($, _, Backbone, Bootstrap, socialSiteTemplate){

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
    },
	
	gplusClick: function() {
		console.log('gplusClick');
		return false;
	},
	fbClick: function() {
		console.log('fbClick');
		return false;
	},
	twClick: function() {
		console.log('twClick');
		return false;
	},
	pinClick: function() {
		console.log('pinClick');
		return false;
	},
	inClick: function() {
		console.log('inClick');
		return false;
	}
	

  });

  return SocialSiteView;
  
});