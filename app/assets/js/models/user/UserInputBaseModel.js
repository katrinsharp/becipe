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
		isValid: function(val, waterMark) {
			var valParts = /^(?!\s*$).+/.exec(val);
			var isValid = (valParts!=null && val!=waterMark);
			if(isValid && waterMark=="Email Address") {
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
		
	return UserInputBaseModel;

});	