define([
  'backbone'
], function(Backbone) {

	var UserInputBaseModel = Backbone.Model.extend({

		defaults: function() {
			//overrride this in models that inherit from it
		},
		url: function() {
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
				return "this is required";
			}
			if(isValid && name=="em") {
				isValid = this.validateEmail(val);
			}
			if(!isValid) {
				return "email is not valid";
			}
			if(isValid && name=="reps") {
				isValid = this.validateReenterPassword(val);
			}
			if(!isValid) {
				return "passwords do not match";
			}
			return "";	
		},
		insertHiddenError: function(name, errorDesc) {
			var error = $('input[name='+name+']').next('span.error');
			if(error.length!=0) {
				$(error).text(errorDesc);
			} else {
				$('input[name='+name+']').after('<span class="error" style="display:none">'+errorDesc+'</span>');
			}
		},
		//called on change: if there is an error, changes to default, which is empty string and isnert hidden error
		enforceValid: function() {
			var model = this;
			var name = _.keys(this.changed);
			var error = this.getError(name, this.changed[name]);
			if(error!="") {
				this.insertHiddenError(name, error);
				this.set(name, "");
			}
		},
		//called on save: all the default values mean invalid user entries
		validate: function(attrs, options) {
			var that = this;
			_.each(_.keys(attrs), function(name){if((attrs[name]!=undefined)&&(attrs[name]=="")){$('input[name='+name+']').addClass('error');that.insertHiddenError(name, "required");}});
			$('span.error').css('display', '');
			$('span.error').prev().addClass('error');
			if($('span.error').length!=0) {
				return 'error';
			}
		}
	});
		
	return UserInputBaseModel;

});	