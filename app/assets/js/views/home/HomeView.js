define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'flexslider',
  'isotope',
  'collections/recipes/RecipeCollection',
  'text!templates/home/homeTemplate.html',
  'views/recipes/RecipeCardView'
], function($, _, Backbone, Bootstrap, Flexslider, Isotope, RecipeCollection, homeTemplate, RecipeCardView){

  var HomeView = Backbone.View.extend({
    
	el: $("#body-container"),

    initialize: function() {
	
		this.recipeCollection = new RecipeCollection();
		this.render();
    },

    render: function(){

		var compiledTemplate = _.template(homeTemplate);
		this.$el.html(compiledTemplate);
		var $container = $('#filter-container');	
		
		$container.imagesLoaded( function(){
			$container.isotope({
				itemSelector : 'figure',
				cornerStampSelector: '.corner-stamp',
				filter: '*',
				isFitWidth: true,
				gutterWidth: 5
			});
		});
		
		$.Isotope.prototype._getCenteredMasonryColumns = function() {
			this.width = this.element.width();
			var parentWidth = this.element.parent().width();
			var colW = this.options && this.options.columnWidth || // i.e. options.masonry && options.masonry.columnWidth
			this.$filteredAtoms.outerWidth(true) || // or use the size of the first item
			parentWidth; // if there's no items, use size of container
			var cols = Math.floor(parentWidth / colW);
			cols = Math.max(cols, 1);
			this.masonry.cols = cols; // i.e. this.masonry.cols = ....
			this.masonry.columnWidth = colW; // i.e. this.masonry.columnWidth = ...
		};
		$.Isotope.prototype._masonryReset = function() {
			this.masonry = {}; // layout-specific props
			this._getCenteredMasonryColumns(); // FIXME shouldn't have to call this again
			var i = this.masonry.cols;
			this.masonry.colYs = [];
				while (i--) {
				this.masonry.colYs.push(0);
			}
		};

		$.Isotope.prototype._masonryResizeChanged = function() {
			var prevColCount = this.masonry.cols;
			this._getCenteredMasonryColumns(); // get updated colCount
			return (this.masonry.cols !== prevColCount);
		};

		$.Isotope.prototype._masonryGetContainerSize = function() {
			var unusedCols = 0,
			i = this.masonry.cols;
				while (--i) { // count unused columns
				if (this.masonry.colYs[i] !== 0) {
					break;
				}
				unusedCols++;
			}

			return {
				height: Math.max.apply(Math, this.masonry.colYs),
				width: (this.masonry.cols - unusedCols) * this.masonry.columnWidth // fit container to columns that have been used;
			};
		};
		
		
		
		$('.flexslider').flexslider({
    		animation: "slide",
    		directionNav: true,
			slideshow: true,	
			controlNav: false,
			slideshowSpeed: 4000
  		});
		
		var that = this, p;
        p = this.recipeCollection.fetch();
        p.done(function () {
			var placeholders = $container.find(RecipeCardView.selector);
            _.each(that.recipeCollection.models, function (item, i) {
				new RecipeCardView({model: item, el: placeholders[i]}).render();
				//$(placeholders[i]).parent().replace(placeholders[i], new RecipeCardView(item).render().$el);
				//$container.append(new RecipeCardView(item).render().el);
            });
			$container.isotope();
        });
		
    }

  });

  return HomeView;
  
});