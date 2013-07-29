define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'text!templates/signup/signupThankyouTemplate.html'
], function($, _, Backbone, Bootstrap, signupThankyouTemplate){

  var SignupThankyouView = Backbone.View.extend({
    el: $("#body-container"),
	
    initialize: function(options) {
		this.name = options.name;
		//if($.cookie('becipe-signup-iteration') == undefined) {
		//	//var date=new Date();
		//	//var dateStr = date.getDate().toString()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
		//	$.cookie('becipe-signup-iteration', '1', {expires: 720, path: '/'});
		//}
    },

    render: function(){
		var compiledTemplate = _.template(signupThankyouTemplate);
		this.$el.html(compiledTemplate({name: this.name}));
    }

  });

  return SignupThankyouView;
  
});