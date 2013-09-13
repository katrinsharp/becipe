define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'bootstrapFileupload',
  'jqueryForm',
  'models/user/UserLoginModel',
  'views/UserInputView',
  'models/recipes/RecipeFormModel',
  'text!templates/recipes/createRecipePageTemplate.html',
  'text!templates/misc/fileUploadTemplate.html'
], function($, _, Backbone, Bootstrap, bootstrapFileupload, jqueryForm, UserLoginModel, UserInputView, RecipeFormModel, createRecipePageTemplate, fileUploadTemplate){

   var CreateRecipeView = UserInputView.extend({
   
	template: createRecipePageTemplate,
   
	events: {
		"click #save": "save"
	},
	
    initialize: function(options) {
		this.model = new RecipeFormModel();
		if(options != undefined) {
			this.model.set({id: options.id});
		}
		UserInputView.prototype.initialize.apply();
		this.events = _.extend({}, UserInputView.prototype.events, {"click #save": "save"});
    },
	
	uploadPhotos: function() {
		var view = this;
		var form = this.$('#fileuploadform');
		$(form).ajaxSubmit({
			data: {
				filenames: _.map($('[data-fname]'), function(el){return $(el).attr('data-fname')})
			},
			url: '/api/0.1/recipe/'+view.model.get('id')+'/photos',
			success: function() {
				window.location.hash = 'recipe/'+view.model.get('id');
			},
			error: function(jqXHR, textStatus, errorThrown) {
			}
		});
	},
	
	render: function() {
		if(this.model.get('id')) {
			var that = this, p;
			p = this.model.fetch();
			p.error(function () {
				that.displayError("no such recipe");
			});
			p.success(function () {
				var m = that.model;
				CreateRecipeView.__super__.render.call(that, m.attributes);
				//upload files thumbnails
				var compiledTemplate = _.template(fileUploadTemplate);
				var placeHolders = that.$(".fileupload-holder");
				var photos = _.filter(m.attributes.photos, function(photo){return photo.metadata.typeOf=='slider'});
				_.each(photos, function(photo, i){ $(placeHolders[i]).html(compiledTemplate({photo: _.extend(photo, {fullUrl: m.attributes.fullUrl(photo)})}))});
				for(var i = photos.length; i < 12; ++i) {
					$(placeHolders[i]).html(compiledTemplate({photo: undefined}));
				}
			});
		} else {
			CreateRecipeView.__super__.render.call(this, this.model.attributes);
			//upload files thumbnails
			var compiledTemplate = _.template(fileUploadTemplate);
			var placeHolders = this.$(".fileupload-holder");
			for(var i = 0; i < 12; ++i) {
				$(placeHolders[i]).html(compiledTemplate({photo: undefined}));
			}
		}
		return this;
	},
	save: function() {
		var view = this;
		var fn = UserLoginModel.get('fn');
		this.model.set('by', fn, {silent: true});
		var existingModel = (this.model.get('id')!=undefined);//create vs edit
		
		
		this.model.save([],{
			success: function (model, response) {
				view.uploadPhotos();
			},
			error: function (model, response) {
				console.log('error submitting recipe..');
			}
		});
		
		return false;  
	}
	
  });
  
  return CreateRecipeView;
  
});