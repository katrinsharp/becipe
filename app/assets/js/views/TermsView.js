define([
  'jquery',
  'underscore',
  'backbone',
   'views/BaseView',
  'text!templates/termsTemplate.html'
], function($, _, Backbone, BaseView, termsTemplate){

  var TermsView = BaseView.extend({
   
    initialize: function() {
    },

    render: function(){
	
		var compiledTemplate = _.template(termsTemplate);
		var view = this;
		view.$el.html(compiledTemplate);
		$('#body-container').html(view.el);
		return this;
    }

  });

  return TermsView;
  
});