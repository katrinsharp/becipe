define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'select2',
  'Events',
  'collections/filters/RecipesFiltersCollection',
  'text!templates/filters/categoryFiltersTemplate.html'
], function($, _, Backbone, Bootstrap, Select2, Events, RecipesFiltersCollection, categoryFiltersTemplate){

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
					
			that.$el.find('.selectpicker').selectpicker({
				width: '100%'
			});
			
			//$('.selectpicker').selectpicker('mobile');
			that.$el.find('button[data-id=filtercategories]').removeClass('btn');
			that.$el.find('button[data-id=filtercategories]').removeClass('btn-default');
			
			that.$el.find('ul.dropdown-menu.inner li[rel=0] a').click({view: that}, that.onClickClear);
			Events.on('searchResultsCloseEvent', that.onSearchResultsClose, that);
		});
		return this;
    },
	
	onChange: function(e) {
		var target = e.currentTarget;
		var categories = _.reduceRight($(target).val(), function(a, b) { return a.concat(b); }, []).join('&');
		this.trigger('clickFilterEvent', {categories: categories});
	},
	
	clearMe: function() {
		this.$el.find('.selectpicker').selectpicker('deselectAll');
	},
	
	onClickClear: function(e) {
		var view = e.data.view;
		view.clearMe();
		view.trigger('clickFilterEvent', {categories: ''});
		return false;
	},
	
	onSearchResultsClose: function() {
		this.clearMe();
	}
	
  });

  return CategoryFiltersView;
  
});