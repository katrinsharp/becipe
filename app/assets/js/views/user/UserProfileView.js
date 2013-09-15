define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'footable2',
  'models/user/UserProfileModel',
  'views/BaseView',
  'text!templates/user/userProfileTemplate.html'
], function($, _, Backbone, Bootstrap, footable2, UserProfileModel, BaseView, userProfileTemplate){

   var UserProfileView = BaseView.extend({
	
    initialize: function(options) {
		this.model = new UserProfileModel({id: options.id});
    },
	
	render: function() {
		var that = this, p;
		p = this.model.fetch();
		p.error(function () {
			that.displayErrorPage("id is invalid");
        });
        p.success(function () {
			var m = that.model;
			var compiledTemplate = _.template(userProfileTemplate);
			that.$el.html(compiledTemplate(m.attributes));
			$('#body-container').html(that.el);
			$('.footable').footable();
        });
		return this;
	}

  });

  return UserProfileView;
  
});