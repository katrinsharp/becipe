define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'globals',
  'views/misc/ModalDialogView',
  'views/misc/SendEmailView',
  'text!templates/social/socialSiteTemplate.html'
], function($, _, Backbone, Bootstrap, globals, ModalDialogView, SendEmailView, socialSiteTemplate){

  var SocialSiteView = Backbone.View.extend({
    el: $(".social-site"),
	selector: ".social-site",
	
	events: {
		"click a[href=gplus]": "gplusClick",
		"click a[href=fb]": "fbClick",
		"click a[href=tw]": "twClick",
		"click a[href=pin]": "pinClick",
		"click a[href=in]": "inClick",
		"click a[href=email]": "emailClick",
		"click a[href=articles]": "sendGaPageView",
		"click a[href=blog]": "sendGaPageView"
	},
	
	sendGaPageView: function(e) {
		var target = '/'+$(e.currentTarget).attr('href');
		if(typeof ga == 'function') {
			var path = location.pathname + $(e.currentTarget).attr('href');
			console.log(path);
		  	ga('send', 'pageview', path);
		}
		return false;
	},

    initialize: function() {
		this.render();
    },

    render: function(){
		var compiledTemplate = _.template(socialSiteTemplate);
		this.$el.html(compiledTemplate);		
		return this;
    },
	
	emailClick: function(e) {
		this.sendGaPageView(e);
		var sendEmailView = new SendEmailView();
		var modalDialogView = new ModalDialogView({
			contentView: sendEmailView, 
			buttonCapture: 'Send', 
			onclose: function(){
				sendEmailView.close()
			}
		});
		modalDialogView.render();
		return false;
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