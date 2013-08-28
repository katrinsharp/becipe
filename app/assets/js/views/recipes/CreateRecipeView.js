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
   
    model: new RecipeFormModel(),
	template: createRecipePageTemplate,
   
	events: {
		"click #save": "save"
	},
	
    initialize: function(options) {
		if(options != undefined) {
			this.model.set({id: options.id});
		}
		UserInputView.prototype.initialize.apply();
		this.events = _.extend({}, UserInputView.prototype.events, {"click #save": "save"});
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
				that.$(".fileupload-holder").html(compiledTemplate());
			});
		} else {
			CreateRecipeView.__super__.render.call(this, this.model.attributes);
			//upload files thumbnails
			var compiledTemplate = _.template(fileUploadTemplate);
			this.$(".fileupload-holder").html(compiledTemplate());
		}
		return this;
	},
	//not much proud for this one..
	save: function() {
		var view = this;
		var fn = UserLoginModel.get('fn');
		this.model.set('by', fn);
		//var params = _.object(_.map(this.model.attributes, function(attr, i){return i.replace('_', '.')}), _.map(this.model.attributes, function(attr, i){return attr}));
		//var tags = params['recipe.tags'].split(",");
		//var tagsParam = _.object(_.map(tags, function(item, i){return "recipe.tags["+i+"]"}), _.map(tags, function(item, i){return item}));
		//params = _.extend(_.omit(params, 'recipe.tags'), tagsParam);
		//var ingredients = params['recipe.ingredients'].split(",");
		//var ingredientsParam = _.object(_.map(ingredients, function(item, i){return "recipe.ingredients["+i+"]"}), _.map(ingredients, function(item, i){return item}));
		//params = _.extend(_.omit(params, 'recipe.ingredients'), ingredientsParam);
		//var tempModel = this.model.clone();
		//tempModel.attributes = {};
		//tempModel.save(params, {
		this.model.save([],{
			success: function (model, response) {
				//view.model.set({recipe_id: response.id});
				var form = this.$('#fileuploadform');
				$(form).ajaxSubmit({
					url: '/api/0.1/recipe/'+view.model.get('id')+'/photos',
					success: function() {
						window.location.hash = 'recipe/'+response.id;
					},
					error: function(jqXHR, textStatus, errorThrown) {
						alert("Error uploading pictures: " + textStatus.responseText);
					}
				});
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