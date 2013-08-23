define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'bootstrapFileupload',
  'jqueryForm',
  'views/user/UserLoginView',
  'views/UserInputView',
  'models/recipes/RecipeFormModel',
  'text!templates/recipes/createRecipePageTemplate.html',
  'text!templates/misc/fileUploadTemplate.html'
], function($, _, Backbone, Bootstrap, bootstrapFileupload, jqueryForm, UserLoginView, UserInputView, RecipeFormModel, createRecipePageTemplate, fileUploadTemplate){

   var CreateRecipeView = UserInputView.extend({
   
    model: new RecipeFormModel(),
	template: createRecipePageTemplate,
   
	events: {
		"click #save": "save"
	},
	
    initialize: function() {
		UserInputView.prototype.initialize.apply();
		this.events = _.extend({}, UserInputView.prototype.events, this.events);
    },
	
	render: function() {
		CreateRecipeView.__super__.render.call(this, {});
		//upload files thumbnails
		var compiledTemplate = _.template(fileUploadTemplate);
		this.$(".fileupload-holder").html(compiledTemplate());
	},
	
	save: function() {
		var view = this;
		var fn = UserLoginView.model.get('fn');
		if(fn!=undefined) this.model.set({recipe_by: fn});
		var params = _.object(_.map(this.model.attributes, function(attr, i){return i.replace('_', '.')}), _.map(this.model.attributes, function(attr, i){return attr}));
		var tags = params['recipe.tags'].split(",");
		var tagsParam = _.object(_.map(tags, function(item, i){return "recipe.tags["+i+"]"}), _.map(tags, function(item, i){return item}));
		params = _.extend(_.omit(params, 'recipe.tags'), tagsParam);
		var ingredients = params['recipe.ingredients'].split(",");
		var ingredientsParam = _.object(_.map(ingredients, function(item, i){return "recipe.ingredients["+i+"]"}), _.map(ingredients, function(item, i){return item}));
		params = _.extend(_.omit(params, 'recipe.ingredients'), ingredientsParam);
		
		var tempModel = this.model.clone();
		tempModel.attributes = {};
		tempModel.save(params, {
			success: function (model, response) {
				view.model.set({recipe_id: response.id});
				var form = this.$('#fileuploadform');
				$(form).ajaxSubmit({url: '/api/0.1/recipe/'+view.model.get('recipe_id')+'/photos'});
				window.location.hash = '#';
			},
			error: function (model, response) {
				//alert("Something went wrong -:(. Please try again.");
			}
		});
		return false;  
	}
	
  });
  
  return CreateRecipeView;
  
});