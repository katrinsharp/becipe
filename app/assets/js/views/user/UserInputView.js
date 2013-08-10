define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'views/BaseView'
], function($, _, Backbone, Bootstrap, BaseView){		

  var UserInputView = BaseView.extend({
    el: $("#body-container"),
	
	events: {
		"focus input": "onFocus",
		"blur input": "onBlur",
		"change input": "onChange"
	},
	
    initialize: function() {
		BaseView.prototype.initialize.apply();
    },
	
	change: function() {
		var view = this;
		this.model.enforceValid();
	},

    render: function(){
		var compiledTemplate = _.template(this.template);
		this.$el.html(compiledTemplate);
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
	}

  });

  return UserInputView;
  
});