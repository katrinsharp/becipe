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

    render: function(options){
		var compiledTemplate = _.template(this.template);
		this.$el.html(compiledTemplate(options));
		this.bindAjaxSubmit();
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
	
	bindAjaxSubmit: function() {
		// jQuery Global Setup
		var ajaxMsg = $('button[type="submit"]');
		ajaxMsg.bind({
			ajaxStart: function() {
				ajaxMsg.attr('orig-label', ajaxMsg.text()).attr('disabled', 'disabled').text('Submitting...');
			},
			ajaxError: function(jqXHR, textStatus, errorThrown) {
			  var error = JSON.parse(textStatus.responseText);
			  if(_.keys(error).length!=0) {
				var key = _.keys(error)[0];
				if(key=='error') {
					
				} else { //specific field error
					var inField = $('input#'+key);
					$(inField).addClass('error');
					$(inField).after('<span class="error">'+error[key]+'</span>');
				}
			  }
			  ajaxMsg.attr('class', 'ajax-success').text(ajaxMsg.attr('orig-label')).removeAttr('disabled');
			},
			ajaxDone: function() {
			  ajaxMsg.attr('class', 'ajax-success').text(ajaxMsg.attr('orig-label')).removeAttr('disabled');
			}
		});
	}
	

  });

  return UserInputView;
  
});