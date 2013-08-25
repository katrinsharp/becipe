define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'globals',
  'views/BaseView'
], function($, _, Backbone, Bootstrap, globals, BaseView){

  var UserSignupThankyouView = BaseView.extend({
    el: $("#body-container"),
	
    initialize: function(options) {
		this.name = options.name;
		this.template = options.template;
		if(options.toSetCookie && ($.cookie('becipe-signup-iteration') == undefined)) {
			//var date=new Date();
			//var dateStr = date.getDate().toString()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
			$.cookie('becipe-signup-iteration', globals.currentIteration, {expires: 720, path: '/'});
		}
		BaseView.prototype.initialize.apply();
    },

    render: function(){
		var compiledTemplate = _.template(this.template);
		this.$el.html(compiledTemplate({name: this.name}));
		return this;
    }

  });

  return UserSignupThankyouView;
  
});