define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'globals',
  'views/filters/RecipesFilterView'
], function($, _, Backbone, Bootstrap, globals, RecipesFilterView){

  var RecipesFiltersView = Backbone.View.extend({
    el: $("#recipes-filters"),
	selector: "#recipes-filters",
	
    initialize: function() {
		this.categories = globals.categories;
    },

    render: function(){
	
		var that = this;
		
		_.each(that.categories, function(model){
			//var view = new RecipesFilterView(model);
			//view.setElement(that.$el.find(view.selector)).render();
			that.$el.append('<li></li>');
			var filterView = new RecipesFilterView({model: model, el: that.$el.find('li').last()}).render();
			that.listenTo(filterView, 'clickFilterEvent', that.onclickFilter);
		});
		
		return this;
    },
	
	//right now we don't use the id of the filter clicked but rather send all the currently checked filters
	onclickFilter: function(data) {
		var filtersString = _.map(this.$el.find('label input:checked'), function(item){return $(item).val()}).join('&');
		this.trigger('clickFilterEvent', {categories: filtersString});
	}
	
  });

  return RecipesFiltersView;
  
});