define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/UserInputView',
  'models/misc/EmailModel',
  'text!templates/misc/sendEmailTemplate.html'
], function($, _, Backbone, Bootstrap, UserInputView, EmailModel, sendEmailTemplate){

   var SendEmailView = UserInputView.extend({
	
   template: sendEmailTemplate,
	
	//events: {
	//	"click #send": "submit"
	//},
	
    initialize: function() {
		this.model = new EmailModel();
		UserInputView.prototype.initialize.apply();
		this.events = _.extend({}, UserInputView.prototype.events, this.events);
    },
	
	validate: function() {
		
		var result = this.model.validate(_.clone(this.model.attributes));
		return (result==undefined);
	},
	
	submit: function(e) {
		this.model.save({id: undefined}, {
			success: function (model, response) {
				console.log('email successfully sent');
			},
			error: function (model, response) {
				console.log('error sending');
			}
		});
		return false;  
	}

  });

  return SendEmailView;
  
});