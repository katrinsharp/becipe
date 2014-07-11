define([
  'jquery',
  'underscore',	
  'backbone',
  'modalEffects',
  'views/BaseView',
  'text!templates/misc/modalWindowTemplate.html'
], function(jquery, _, Backbone, modalEffects, BaseView, modalWindowTemplate){

  var ModalDialogView = BaseView.extend({
  
	className: 'md-modal',
	
	events: {
		'click .md-close': 'submit'
	},
  
    initialize: function(options) {
		this.onclose = this.options.onclose;
		this.contentView = this.options.contentView;
		this.content = this.options.content;
		this.buttonCapture = options.buttonCapture;
		
		$(document).on( "keydown", {view: this}, this.keyPress);
		
		BaseView.prototype.initialize.apply();
    },
	
	close: function() {
		$(document).off( "keydown", {view: this}, this.keyPress);
		this.remove();
	},
	
	keyPress: function(e) {
		var view = e.data.view;
		switch(e.keyCode) {
		  case 27:
			view.closeDialog();
			break;
		  case 13:
			view.submit();
			break;
		}
	},
	
    render: function() {
		var compiledTemplate = _.template(modalWindowTemplate);
		this.$el.html(compiledTemplate({buttonCapture: this.buttonCapture}));
		this.onRender();	
		this.$el.addClass('md-effect-1');
		this.$el.addClass('modal-style');
		document.body.appendChild(this.el);			
		$('.md-modal').after('<div class="md-overlay"></div>');	  
		this.$el.show();
		this.delegateEvents();
		setTimeout(_.bind(function(){
			this.$el.addClass('md-show');
		},this), 200);		
		return this;
	},
	
	onRender: function () {
      if (this.contentView) {
        this.$el.find(".user-content").html(this.contentView.render({el: '.modal-dialog'}).el);
      } else {
        this.$el.find(".user-content").html(this.content || "");
      }
    },
	
	submit: function() {
		var valid = true;
		if(this.contentView.validate) {
			valid = this.contentView.validate();
		}
		if(valid) {
			this.contentView.submit();
			this.closeDialog();
		}
	},
	
	closeDialog: function() {
	
		var view = this;
		this.$el.removeClass('md-show');
		if(this.onclose) {
			this.onclose();
		}
		setTimeout(function () {
			view.remove();
		}, 200);
	}
  });

  return ModalDialogView;
  
});