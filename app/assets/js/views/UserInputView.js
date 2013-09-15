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
  'bootstrapWysihtml5',
  'autosize',
  'views/BaseView'
], function($, _, Backbone, Bootstrap, BootstrapEditable, Select2, Poshytip, bootstrapSelect, Placeholder, wysihtml5, autosize, BaseView){		

  var UserInputView = BaseView.extend({
    //el: $("#body-container"),
	
	events: {
		"focus [name]": "onFocus",
		"blur [name]": "onBlur",
		"keyup [name]": "onChange",
		"change [name]": "onChange",
		"click input[type=file]": "fileInputClick"
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
		$('#body-container').html(this.el);
		
		$('input').placeholder();
		//x-editable if any
		$.fn.editable.defaults.mode = 'inline';
		var options = {display: this.displayXEditable};
		$('[data-tp="editable"]').editable(options);
		$('[data-tp="select2"]').editable({select2: {
            tags: ['html', 'javascript', 'css', 'ajax'],//debug
            tokenSeparators: [",", " "]
        }});
		//this.$('[title]').poshytip({
		//	className: 'tip-darkgray',
		//	showOn: 'focus',
		//	alignTo: 'target',
		//	alignX: 'right',
		//	alignY: 'center',
		//	offsetX: 5,
		//	showTimeout: 100
		//});
		$('.wysihtml5').wysihtml5();
		$('.autosize').autosize();
		$('.selectpicker').selectpicker();
		//needed for emails and such. upon validate we don't know which fields need specific validation
		this.listenTo(this.model, 'change', this.change);
		this.bindAjaxSubmitButton();
		return this;
    },
	
	close: function() {
		this.unbindAjaxSubmitButton();
		$('.tip-darkgray').remove();
		this.remove();
	},
	
	fileInputClick: function(e) {
		var target = e.currentTarget;
		//should in this order otherwise seond will not work
		$(target).closest('.fileupload').find('span.error').remove();
		$(target).closest('.fileupload').find('.error').removeClass('error');
		this.model.set('filesChanged', true, {silent: true});
		return true;
	},
	
	onChange: function(e) {
		var target = e.currentTarget;
		console.log(e.type +": "+target.value);
		//optional values
		if(((this.model.get(target.id) != undefined) || (target.value != '')) && (target.value != undefined) && (target.id != '')) {
			console.log("set : "+target.id);
			this.model.set(target.id, target.value, {silent: true});	
		}
		//upload files
		if($(target).attr('type')=='file') {
			var paths = target.value.split('\\');
			var fname = paths[paths.length - 1].replace(/\./g,'_');
			$(target).attr('data-fname', fname);
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
	
	displayError: function(resp, stText) {
		var ajaxMsg = $('button[type="submit"]');
		if(resp != undefined) {	
			var error = {};
			try{
				error = JSON.parse(resp);
			}catch(e){
				error = {error: resp};
			}
			
			if(_.keys(error).length!=0) {
				var key = _.keys(error)[0];
				if(key=='error') {
					var msg = stText;
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
		}
		ajaxMsg.attr('class', 'ajax-success').text(ajaxMsg.attr('orig-label')).removeAttr('disabled');
	},
	
	bindAjaxSubmitButton: function() {
		var view = this;
		// jQuery Global Setup
		var ajaxMsg = $('button[type="submit"]');
		ajaxMsg.bind({
			ajaxStart: function() {
				ajaxMsg.attr('orig-label', ajaxMsg.text()).attr('disabled', 'disabled').text('Submitting...');
				$('span.error').remove();
			},
			ajaxError: function(jqXHR, textStatus, errorThrown) {
				var responseText = textStatus.responseText;
				var statusText = textStatus.statusText;
				view.displayError(responseText, statusText);
			},
			ajaxDone: function() {
				ajaxMsg.attr('class', 'ajax-success').text(ajaxMsg.attr('orig-label')).removeAttr('disabled');
			}
		});
	}

  });

  return UserInputView;
  
});