define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/social/SocialSiteView',
  'text!templates/signup/signupTemplate.html'
], function($, _, Backbone, Bootstrap, SocialSiteView, signupTemplate){

   var SignupDetails = Backbone.Model.extend({

		defaults: function() {
			return {
				fn: "First Name",
				ln: "Last Name",
				em: "Email"
			};
		},
		url: function() {
			return '/api/0.1/signup/add';
		},
		validateEmail: function(email) {
			var splitted = email.match("^(.+)@(.+)$");
			if (splitted == null) return false;
			if (splitted[1] != null)
			{
				var regexp_user = /^\"?[\w-_\.]*\"?$/;
				if (splitted[1].match(regexp_user) == null) return false;
			}
			if (splitted[2] != null)
			{
				var regexp_domain = /^[\w-\.]*\.[A-Za-z]{2,4}$/;
				if (splitted[2].match(regexp_domain) == null)
				{
					var regexp_ip = /^\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]$/;
					if (splitted[2].match(regexp_ip) == null) return false;
				} 
				return true;
			}
			return false;
		},
		isValid: function(val, waterMark) {
			var valParts = /^(?!\s*$).+/.exec(val);
			var isValid = (valParts!=null && val!=waterMark);
			if(isValid && waterMark=="Email") {
				isValid = this.validateEmail(val);
			}
			return isValid;	
		},
		//called on change: if there is an error, changes to default
		enforceValid: function() {
			var model = this;
			_.map(_.keys(this.changed), function(name){if(!model.isValid(model.changed[name], model.defaults()[name])){model.set(name, model.defaults()[name])}});	
		},
		//called on save: all the default values mean invalid user entries
		validate: function(attrs, options) {
			_.map(_.keys(this.defaults()), function(id){$('#'+id).removeClass("error")});
			var numOfErrors = _.map(_.values(_.pick(_.invert(attrs), _.values(this.defaults()))), function(id){$('#'+id).addClass("error")}).length;
			if(numOfErrors!=0) {
				return 'error';
			}
		}
	});		

  var SignupView = Backbone.View.extend({
    el: $("#body-container"),
	
	model: new SignupDetails(),
	
	events: {
		"focus input": "onFocus",
		"blur input": "onBlur",
		"change input": "onChange",
		"click #signup": "signup"
	},
	
    initialize: function() {
    },
	
	change: function() {
		var view = this;
		this.model.enforceValid();
	},

    render: function(){
		var compiledTemplate = _.template(signupTemplate);
		this.$el.html(compiledTemplate);
		this.socialSiteView = new SocialSiteView();
		this.socialSiteView.setElement(this.$el.find(this.socialSiteView.selector)).render();
		this.listenTo(this.model, 'change', this.change);
    },
	
	onChange: function(e) {
		var target = e.currentTarget;
		this.model.set(target.id, target.value);
	},
	
	onFocus: function(e) {
		var target = e.currentTarget;
		$(target).removeClass("error"); 
		$(target).removeClass("empty");
		var val = $(target).val();  
		var waterMark = $(target).attr("data");
		if (val == waterMark || val == "") { $(target).val(''); } 	
	},
	
	onBlur: function(e) {
		var target = e.currentTarget;
		$(target).removeClass("error");
		var val = $(target).val();  
		var waterMark = $(target).attr("data");
		if (val == "") { $(target).val(waterMark); $(target).addClass("empty"); }
	},
	
	signup: function(e) {
		this.model.save({id: undefined}, {
			success: function (model, response) {
				window.location.hash = 'signup-thankyou/'+ model.get('fn');
			},
			error: function (model, response) {
				alert("Something went wrong -:(. Please try again.");
			}
		});
		return false;  
	}

  });

  return SignupView;
  
});