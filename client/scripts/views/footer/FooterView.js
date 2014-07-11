define([
  'jquery',
  'underscore',
  'backbone',
  'globals',
  'views/social/SocialSiteView',
  'text!templates/footer/footerTemplate.html'
], function($, _, Backbone, globals, SocialSiteView, footerTemplate){

  var FooterView = Backbone.View.extend({
    el: $("#footer"),

    initialize: function() {
		this.categories = globals.categories;
    },

    render: function(){
	
		var compiledTemplate = _.template(footerTemplate);
		var view = this;
		view.$el.html(compiledTemplate({categories: this.categories}));
		
		this.socialSiteView = new SocialSiteView();
		this.socialSiteView.setElement($(this.socialSiteView.selector)).render();
		
		return this;
    }

  });

  return FooterView;
  
});