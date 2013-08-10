define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/BaseView',
  'text!templates/user/userSignupThankyouTemplate.html'
], function($, _, Backbone, Bootstrap, BaseView, userSignupThankyouTemplate){

  var UserSignupThankyouView = BaseView.extend({
    el: $("#body-container"),
	
    initialize: function(options) {
		this.name = options.name;
		if($.cookie('becipe-signup-iteration') == undefined) {
			//var date=new Date();
			//var dateStr = date.getDate().toString()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
			$.cookie('becipe-signup-iteration', 3, {expires: 720, path: '/'});
		}
		BaseView.prototype.initialize.apply();
    },

    render: function(){
		var compiledTemplate = _.template(userSignupThankyouTemplate);
		this.$el.html(compiledTemplate({name: this.name}));
    }

  });

  return UserSignupThankyouView;
  
});