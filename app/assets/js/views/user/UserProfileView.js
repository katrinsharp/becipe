define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'models/user/UserProfileModel',
  'views/BaseView',
  'text!templates/user/userProfileTemplate.html'
], function($, _, Backbone, Bootstrap, UserProfileModel, BaseView, userProfileTemplate){

   var UserProfileView = BaseView.extend({
	
    initialize: function(options) {
		this.model = new UserProfileModel({id: options.id});
    },
	
	render: function() {
		var that = this, p;
		p = this.model.fetch();
		p.error(function () {
			that.displayError("id is invalid");
        });
        p.success(function () {
			var m = that.model;
			var compiledTemplate = _.template(userProfileTemplate);
			that.$el.html(compiledTemplate(m.attributes));
			$('#body-container').append(that.el);
        });
		return this;
	}

  });

  return UserProfileView;
  
});