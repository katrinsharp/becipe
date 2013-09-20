define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'bootstrapSelect',
  'footable2',
  'models/user/UserProfileModel',
  'views/BaseView',
  'text!templates/user/userProfileTemplate.html'
], function($, _, Backbone, Bootstrap, bootstrapSelect, footable2, UserProfileModel, BaseView, userProfileTemplate){

   var UserProfileView = BaseView.extend({
	
    initialize: function(options) {
		this.model = new UserProfileModel({id: options.id});
    },
	
	events: {
		"change .visibility": "visibilityChange"
	},
	
	visibilityChange: function(e) {
		var target = e.currentTarget;
		var recipeId = $(target).attr('data-id');
		var value = $(target).val();
		
		$.ajax("/api/0.1/recipe/" + recipeId + "?attrNames=draft", {
			type: "PUT",
			data: {'value[0]': value},
			success: function() {
				console.log('success');
			},
			error: function() {
				console.log('error');
		   }
		});
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
			$('.selectpicker').selectpicker();
			$('.footable').footable();
        });
		return this;
	}

  });

  return UserProfileView;
  
});