define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'collections/filters/RecipesFiltersCollection',
  'views/filters/RecipesFilterView'
], function($, _, Backbone, Bootstrap, RecipesFiltersCollection, RecipesFilterView){

  var RecipesFiltersView = Backbone.View.extend({
    el: $("#recipes-filters"),
	selector: "#recipes-filters",
	
    initialize: function() {
		this.filterCollection = new RecipesFiltersCollection();
    },

    render: function(){
	
		var that = this, p;
		p = this.filterCollection.fetch();
		p.done(function () {
			_.each(that.filterCollection.models, function(model){
				//var view = new RecipesFilterView(model);
				//view.setElement(that.$el.find(view.selector)).render();
				that.$el.append('<li></li>');
				var filterView = new RecipesFilterView({model: model, el: that.$el.find('li').last()}).render();
				that.listenTo(filterView, 'clickFilterEvent', that.onclickFilter);
			});
		});
		return this;
    },
	
	//right now we don't use the id of the filter clicked but rather send all the currently checked filters
	onclickFilter: function(data) {
		var filtersString = _.map(this.$el.find('label input:checked'), function(item){return $(item).val()}).join('&');
		this.trigger('clickFilterEvent', {filtersString: filtersString});
	}
	
  });

  return RecipesFiltersView;
  
});