define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'select2',
  'text!templates/filters/filterFiltersTemplate.html'
], function($, _, Backbone, Bootstrap, Select2, filterFiltersTemplate){

  var FilterFiltersView = Backbone.View.extend({
    
	el: $(".filter-filters-container"),
	selector: ".filter-filters-container",
	
	events: {
		"change [name]": "onChange"
	},
	
    initialize: function() {
    },

    render: function(){
		var that = this;
		
		var compiledTemplate = _.template(filterFiltersTemplate);
		that.setElement($(that.selector));
		
		that.$el.html(compiledTemplate);
				
		$('.selectpicker').selectpicker({
			width: '100%'
		});
		//$('.selectpicker').selectpicker('mobile');
		$('button[data-id=filterfilter]').removeClass('btn');
		$('button[data-id=filterfilter]').removeClass('btn-default');

		return this;
    },
	
	onChange: function(e) {
		var target = e.currentTarget;
		this.trigger('clickFilterEvent', {filtersString: $(target).val(), type: 'level'});
	}
	
  });

  return FilterFiltersView;
  
});