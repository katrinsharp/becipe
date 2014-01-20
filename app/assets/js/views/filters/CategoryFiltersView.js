define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'select2',
  'collections/filters/RecipesFiltersCollection',
  'text!templates/filters/categoryFiltersTemplate.html'
], function($, _, Backbone, Bootstrap, Select2, RecipesFiltersCollection, categoryFiltersTemplate){

  var CategoryFiltersView = Backbone.View.extend({
    
	el: $(".category-filters-container"),
	selector: ".category-filters-container",
	
	events: {
		"change [name]": "onChange"
	},
	
    initialize: function() {
		this.filterCollection = new RecipesFiltersCollection();
    },

    render: function(){
		var that = this, p;
		p = this.filterCollection.fetch();
		p.done(function () {
			var compiledTemplate = _.template(categoryFiltersTemplate);
			that.setElement($(that.selector));
			
			that.$el.html(compiledTemplate({recipeFilters: that.filterCollection.models}));
					
			$('.selectpicker').selectpicker({
				width: '100%'
			});
			//$('.selectpicker').selectpicker('mobile');
			$('button[data-id=filtercategories]').removeClass('btn');
			$('button[data-id=filtercategories]').removeClass('btn-default');
		});
		return this;
    },
	
	onChange: function(e) {
		var target = e.currentTarget;
		
		var categories = _.reduceRight($(target).val(), function(a, b) { return a.concat(b); }, []).join('&');
		this.trigger('clickFilterEvent', {filtersString: categories, type: 'categories'});
	}
	
  });

  return CategoryFiltersView;
  
});