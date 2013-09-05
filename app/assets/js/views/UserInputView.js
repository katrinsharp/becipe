define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'bootstrapeditable',
  'select2',
  'poshytip',
  'bootstrapSelect',
  'placeholder',
  'views/BaseView'
], function($, _, Backbone, Bootstrap, BootstrapEditable, Select2, Poshytip, bootstrapSelect, Placeholder, BaseView){		

  var UserInputView = BaseView.extend({
    //el: $("#body-container"),
	
	events: {
		"focus [name]": "onFocus",
		"blur [name]": "onBlur",
		"keyup [name]": "onChange"
	},
	
    initialize: function() {
		BaseView.prototype.initialize.apply();
    },
	
	change: function() {
		var view = this;
		this.model.enforceValid();
	},
	
	displayXEditable: function(value) {
		$(this).text(value);
        $('input[name="'+$(this).attr('name')+'"]').val(value);
    },

    render: function(options){
		var compiledTemplate = _.template(this.template);
		this.$el.html(compiledTemplate(options));
		$('#body-container').append(this.el);
		
		$('input').placeholder();
		//x-editable if any
		$.fn.editable.defaults.mode = 'inline';
		var options = {display: this.displayXEditable};
		$('[data-tp="editable"]').editable(options);
		$('[data-tp="select2"]').editable({select2: {
            tags: ['html', 'javascript', 'css', 'ajax'],//debug
            tokenSeparators: [",", " "]
        }});
		this.$('[title]').poshytip({
			className: 'tip-darkgray',
			showOn: 'focus',
			alignTo: 'target',
			alignX: 'right',
			alignY: 'center',
			offsetX: 5,
			showTimeout: 100
		});
		$('.selectpicker').selectpicker();
		//this.listenTo(this.model, 'change', this.change);
		this.bindAjaxSubmitButton();
		return this;
    },
	
	close: function() {
		this.unbindAjaxSubmitButton();
		$('.tip-darkgray').remove();
		this.remove();
	},
	
	onChange: function(e) {
		var target = e.currentTarget;
		console.log(e.type +": "+target.value);
		//optional values
		if((this.model.get(target.id) != undefined) || (target.value != '')) {
			this.model.set(target.id, target.value);	
		}
		return true;
	},
	
	onFocus: function(e) {
		var target = e.currentTarget;
		$(target).removeClass("error"); 
		$(target).next('span.error').remove();
	},
	
	onBlur: function(e) {
	},
	
	unbindAjaxSubmitButton: function() {
		var ajaxMsg = $('button[type="submit"]');
		ajaxMsg.unbind("ajaxStart");
		ajaxMsg.unbind("ajaxError");
		ajaxMsg.unbind("ajaxDone");
	},
	
	bindAjaxSubmitButton: function() {
		// jQuery Global Setup
		var ajaxMsg = $('button[type="submit"]');
		ajaxMsg.bind({
			ajaxStart: function() {
				ajaxMsg.attr('orig-label', ajaxMsg.text()).attr('disabled', 'disabled').text('Submitting...');
				$('span.error').remove();
			},
			ajaxError: function(jqXHR, textStatus, errorThrown) {
				var error = {};
				try{
					error = JSON.parse(textStatus.responseText);
				}catch(e){
					error = {error: textStatus.responseText};
				}
				
				if(_.keys(error).length!=0) {
					var key = _.keys(error)[0];
					if(key=='error') {
						var msg = textStatus.statusText;
						if(msg=='Unauthorized') {
							msg = 'Please login first';
						}
						$('button[type=submit]').before('<div><span class="error general-error">'+error[key]+'</span></div>');
					} else { //specific field error
						var inField = $('[name='+key+']');
						var errors = $(inField).next('span.error');
						if(errors.length!=0) {
							$(errors).text(error[key]);
						} else {
							$(inField).after('<span class="error">'+error[key]+'</span>');
						}
						$(inField).addClass('error');
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