define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/social/SocialSiteView',
  'text!templates/header/headerTemplate.html'
], function($, _, Backbone, Bootstrap, SocialSiteView, headerTemplate){

  var HeaderView = Backbone.View.extend({
    
	el: $("#header"),
	
    initialize: function() {
		this.render();
    },

    render: function(){
      var compiledTemplate = _.template(headerTemplate);
      this.$el.html(compiledTemplate);
	  this.socialSiteView = new SocialSiteView();
	  this.socialSiteView.setElement(this.$el.find(this.socialSiteView.selector)).render();
    }

  });

  return HeaderView;
  
});