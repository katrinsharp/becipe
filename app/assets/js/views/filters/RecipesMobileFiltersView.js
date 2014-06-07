define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'select2',
  'globals',
  'text!templates/filters/mobileFilterSortTemplate.html',
  'views/filters/CategoryFiltersView',
  'views/filters/FilterFiltersView',
  'Events'
], function($, _, Backbone, Bootstrap, Select2, globals, mobileFilterSortTemplate, CategoryFiltersView, FilterFiltersView, Events){

  var RecipesMobileFiltersView = Backbone.View.extend({
    
	el: $("#mobileSort"),
	
	timer: {},
	
	isHidden: true,
	
	scrollingStopped: function() {
		if(!$(window).scrollTop()) {
			$('.search-footer-container').removeClass('display-none');
		} else {
			$('.search-footer-container').addClass('display-none');
		}
	},
	
    initialize: function() {
		this.categories = globals.categories;
		var view = this;
		$(window).bind('scroll',function () {
			if(!view.isHidden) {
				$('.search-footer-container').addClass('display-none');
				clearTimeout(view.timer);
				view.timer = setTimeout(view.scrollingStopped, 150);
			}
		});
    },

    render: function(){
		var that = this;
		var compiledTemplate = _.template(mobileFilterSortTemplate);
		that.$el.html(compiledTemplate({recipeFilters: that.categories}));
		that.categoryFiltersView = new CategoryFiltersView();
		that.categoryFiltersView.setElement(that.$el.find(that.categoryFiltersView.selector)).render();
		that.listenTo(that.categoryFiltersView, 'clickFilterEvent', that.onclickFilter);
		
		that.filterFiltersView = new FilterFiltersView();
		that.filterFiltersView.setElement(that.$el.find(that.filterFiltersView.selector)).render();
		that.listenTo(that.filterFiltersView, 'clickFilterEvent', that.onclickFilter);
		
		//since it is created only once and hidden, shows up only on search results page
		$('.search-footer-container').addClass('display-none');
		
		//makes sure that 'this' is an view objects and not Events
		Events.on('searchResultsRenderEvent', that.onSearchResultsRender, that);
		Events.on('searchResultsCloseEvent', that.onSearchResultsClose, that);
		
		return this;
    },
	onSearchResultsRender: function() {
		$('.search-footer-container').removeClass('display-none');
		this.isHidden = false;
	},
	
	onSearchResultsClose: function() {
		$('.search-footer-container').addClass('display-none');
		this.isHidden = true;
	},
	
	onclickFilter: function(data) {
		this.trigger('clickFilterEvent', data);
	}
	
  });

  return RecipesMobileFiltersView;
  
});