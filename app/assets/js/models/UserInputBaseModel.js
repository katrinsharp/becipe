define([
  'backbone'
], function(Backbone) {

	var UserInputBaseModel = Backbone.Model.extend({

		defaults: function() {
			//overrride this in models that inherit from it
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
				var regexp_domain = /^[\w-\.]+\.[A-Za-z]{2,4}$/;
				if (splitted[2].match(regexp_domain) == null)
				{
					var regexp_ip = /^\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]$/;
					if (splitted[2].match(regexp_ip) == null) return false;
				} 
				return true;
			}
			return false;
		},
		validateReenterPassword: function(val) {
			var pass = $('input#ps').val();
			return (pass==val);
		},
		getError: function(name, val) {
			var valParts = /^(?!\s*$).+/.exec(val);
			var isValid = (valParts!=null && val!="");
			if(!isValid) {
				return "This is required";
			}
			if(name=="em") {
				isValid = this.validateEmail(val);
				if(!isValid) {
					return "email is not valid";
				}
			}
			if(name=="reps") {
				isValid = this.validateReenterPassword(val);
				if(!isValid) {
					return "passwords do not match";
				}
			}
			
			return "";	
		},
		insertHiddenError: function(name, errorDesc) {
			var error = $('[name='+name+']').next('span.error');
			if(error.length!=0) {
				$(error).text(errorDesc);
			} else {
				$('[name='+name+']').after('<span class="error" style="display:none">'+errorDesc+'</span>');
			}
		},
		enforceValid: function() {
			var model = this;
			
			_.each(this.attributes, function(value, name){
				if(value!=undefined&&name!=undefined) {
					var error = model.getError(name, value);
					if(error!="") {
						model.insertHiddenError(name, error);
						model.set(name, "", {silent: true});
					} else {
						$('[name='+name+']').next('span.error').remove();
					}
				}
			});
		},
		//called on save: all the default values mean invalid user entries
		validate: function(attrs, options) {
		
			this.enforceValid();
			
			//preprocessing
			if(_.contains(_.keys(this.attributes), 'directions')) {
				var directions = $('[name=directions]').val();
				this.set({directions: directions});
				attrs['directions'] = directions;
			}
			if(_.contains(_.keys(this.attributes), 'ingredients')) {
				var ingredients = $('[name=ingredients]').val().split('\n').join(';');
				this.set({ingredients: ingredients});
			}
			//end preprocessing
			
			var that = this;
			_.each(_.keys(attrs), function(name){if((attrs[name]!=undefined)&&(attrs[name]=="")){$('[name='+name+']').addClass('error');that.insertHiddenError(name, "This is required");}});
			$('span.error').css('display', '');
			$('span.error').prev().addClass('error');
			if($('span.error').not('span.general-error').length!=0) {
				return 'error';
			}
		}
	});
		
	return UserInputBaseModel;

});	