define([
  'jquery', 
  'underscore', 
  'backbone',
  'module'
], function($, _, Backbone, module){

	var initialize = function(){
		this.currentIteration = module.config().currentIteration;
		//this.photoBaseUrl = module.config().photoBaseUrl;
		this.recipeHelpers = {
			date: function(time){
				var date = moment(time).format('LL');
				return date;
			},
			previewUrl: function(photos){
				var photoBaseUrl = module.config().photoBaseUrl;
				var bucket = '';
				var key = '';
				var preview = _.find(photos, function(photo){ return photo.metadata.typeOf == 'preview'; });
				if(preview!=undefined) {
					bucket = preview.bucket;
					key = preview.key;
				}
				var previewUrl = photoBaseUrl + '/' + bucket + '/' + key;
				return previewUrl;
			},
			fullUrl: function(options){
				var previewUrl = module.config().photoBaseUrl + '/' + options.bucket + '/' + options.key;
				return previewUrl;
			}
	}
	};

	return { 
		initialize: initialize
	};
});