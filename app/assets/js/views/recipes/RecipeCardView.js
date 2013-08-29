define([
  'backbone',
  'globals',
  'text!templates/recipes/recipeCardTemplate.html'
], function(Backbone, globals, recipeCardTemplate){

  var RecipeCardView = Backbone.View.extend({
  
	selector: "figure.placeholder",
	
	events: {
		'click a[href="#like"]': 'likeIt'
	},
    
    initialize: function(options) {
		this.model = options.model;
		this.setElement(options.el);//.render();
    },
	
    render: function() {
		var compiledTemplate = _.template(recipeCardTemplate);
		var photoBaseUrl = globals.photoBaseUrl;
		var bucket = '';
		var key = '';
		var preview = _.find(this.model.get('photos'), function(photo){ return photo.metadata.typeOf == 'preview'; });
		if(preview!=undefined) {
			bucket = preview.bucket;
			key = preview.key;
		}
		var previewUrl = photoBaseUrl + '/' + bucket + '/' + key;
		var options = _.extend(this.model.attributes, {previewUrl: previewUrl});
		this.$el.html(compiledTemplate(options));
		return this;
	},
	
	likeIt: function(e) {
		e.preventDefault();
		console.log('like it');
		return false;
	}

  });
  
  RecipeCardView.selector = "figure.placeholder";

  return RecipeCardView;
  
});