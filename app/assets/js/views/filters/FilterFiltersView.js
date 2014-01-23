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
				
		that.$el.find('.selectpicker').selectpicker({
			width: '100%'
		});
		//$('.selectpicker').selectpicker('mobile');
		that.$el.find('button[data-id=filterlevel]').removeClass('btn');
		that.$el.find('button[data-id=filterlevel]').removeClass('btn-default');
		that.$el.find('.btn-group.bootstrap-select').addClass('show-tick');
		//$(that.$el.find('.dropdown-menu.inner li')[0]).find('i.glyphicon').remove();

		return this;
    },
	
	onChange: function(e) {
		var target = e.currentTarget;
		this.trigger('clickFilterEvent', {filtersString: $(target).val(), type: 'level'});
	}
	
  });

  return FilterFiltersView;
  
});