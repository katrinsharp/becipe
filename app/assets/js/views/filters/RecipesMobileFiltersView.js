define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'select2',
  'collections/filters/RecipesFiltersCollection',
  'text!templates/filters/mobileFilterSortTemplate.html',
  'views/filters/CategoryFiltersView',
  'views/filters/FilterFiltersView'
], function($, _, Backbone, Bootstrap, Select2, RecipesFiltersCollection, mobileFilterSortTemplate, CategoryFiltersView, FilterFiltersView){

  var RecipesMobileFiltersView = Backbone.View.extend({
    
	el: $("#mobileSort"),
	
	timer: {},
	
	scrollingStopped: function() {
		if(!$(window).scrollTop()) {
			$('.search-footer-container').removeClass('display-none');
		} else {
			$('.search-footer-container').addClass('display-none');
		}
	},
	
    initialize: function() {
		this.filterCollection = new RecipesFiltersCollection();
		var view = this;
		$(window).bind('scroll',function () {
			$('.search-footer-container').addClass('display-none');
			clearTimeout(view.timer);
			view.timer = setTimeout(view.scrollingStopped, 150);
		});
    },

    render: function(){
		var that = this, p;
		p = this.filterCollection.fetch();
		p.done(function () {
			var compiledTemplate = _.template(mobileFilterSortTemplate);
			that.$el.html(compiledTemplate({recipeFilters: that.filterCollection.models}));
			that.categoryFiltersView = new CategoryFiltersView();
			that.categoryFiltersView.setElement(that.$el.find(that.categoryFiltersView.selector)).render();
			that.listenTo(that.categoryFiltersView, 'clickFilterEvent', that.onclickFilter);
			
			that.filterFiltersView = new FilterFiltersView();
			that.filterFiltersView.setElement(that.$el.find(that.filterFiltersView.selector)).render();
			that.listenTo(that.filterFiltersView, 'clickFilterEvent', that.onclickFilter);
		});
		return this;
    },
	
	onclickFilter: function(data) {
		this.trigger('clickFilterEvent', data);
	}
	
  });

  return RecipesMobileFiltersView;
  
});