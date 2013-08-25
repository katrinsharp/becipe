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
    el: $("#body-container"),
	
	events: {
		"focus input": "onFocus",
		"blur input": "onBlur",
		"change [name]": "onChange"
	},
	
    initialize: function() {
		BaseView.prototype.initialize.apply();
		$('input').placeholder();
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
		
		//x-editable if any
		$.fn.editable.defaults.mode = 'inline';
		var options = {display: this.displayXEditable};
		$('[data-tp="editable"]').editable(options);
		$('[data-tp="select2"]').editable({select2: {
            tags: ['html', 'javascript', 'css', 'ajax'],//debug
            tokenSeparators: [",", " "]
        }});
		$('[title]').poshytip({
			className: 'tip-darkgray',
			showOn: 'focus',
			alignTo: 'target',
			alignX: 'right',
			alignY: 'center',
			offsetX: 5,
			showTimeout: 100
		});
		$('.selectpicker').selectpicker();
		this.listenTo(this.model, 'change', this.change);
		return this;
    },
	
	onChange: function(e) {
		var target = e.currentTarget;
		this.model.set(target.id, target.value);
	},
	
	onFocus: function(e) {
		var target = e.currentTarget;
		$(target).removeClass("error"); 
		$(target).next('span.error').remove();
	},
	
	onBlur: function(e) {
	}

  });

  return UserInputView;
  
});