define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/BaseView'
], function($, _, Backbone, Bootstrap, BaseView){

  var UserSignupThankyouView = BaseView.extend({
    el: $("#body-container"),
	
    initialize: function(options) {
		this.name = options.name;
		this.template = options.template;
		if(options.toSetCoookie && ($.cookie('becipe-signup-iteration') == undefined)) {
			//var date=new Date();
			//var dateStr = date.getDate().toString()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
			$.cookie('becipe-signup-iteration', 3, {expires: 720, path: '/'});
		}
		BaseView.prototype.initialize.apply();
    },

    render: function(){
		var compiledTemplate = _.template(this.template);
		this.$el.html(compiledTemplate({name: this.name}));
    }

  });

  return UserSignupThankyouView;
  
});