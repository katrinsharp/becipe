define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'select2',
  'collections/filters/RecipesFiltersCollection',
  'text!templates/filters/mobileFilterSortTemplate.html'
], function($, _, Backbone, Bootstrap, Select2, RecipesFiltersCollection, mobileFilterSortTemplate){

  var RecipesMobileFiltersView = Backbone.View.extend({
    
	el: $("#mobileSort"),
	
	timer: {},
	
	events: {
		"change [name]": "onChange"
	},
	
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
			$('.selectpicker').selectpicker({
				width: '100%'
			});
			//$('.selectpicker').selectpicker('mobile');
			$('button[data-id=categories]').removeClass('btn');
			$('button[data-id=categories]').removeClass('btn-default');
		});
		return this;
    },
	
	onChange: function(e) {
		var target = e.currentTarget;
		if(target.id=="categories") {
			var categories = _.reduceRight($('[name='+target.id+']').val(), function(a, b) { return a.concat(b); }, []).join('&');
			this.trigger('clickFilterEvent', {filtersString: categories});
		}
	}
	
  });

  return RecipesMobileFiltersView;
  
});