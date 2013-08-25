define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'globals',
  'views/BaseView',
  'text!templates/signup/signupThankyouTemplate.html'
], function($, _, Backbone, Bootstrap, globals, BaseView, signupThankyouTemplate){

  var SignupThankyouView = BaseView.extend({
    el: $("#body-container"),
	
    initialize: function(options) {
		this.name = options.name;
		if($.cookie('becipe-signup-iteration') == undefined) {
			//var date=new Date();
			//var dateStr = date.getDate().toString()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
			$.cookie('becipe-signup-iteration', globals.currentIteration, {expires: 720, path: '/'});
		}
		BaseView.prototype.initialize.apply();
    },

    render: function(){
		var compiledTemplate = _.template(signupThankyouTemplate);
		this.$el.html(compiledTemplate({name: this.name}));
		return this;
    }

  });

  return SignupThankyouView;
  
});