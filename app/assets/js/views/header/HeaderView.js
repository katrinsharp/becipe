define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'collections/recipes/RecipeCollection',
  'views/social/SocialSiteView',
  'text!templates/header/headerTemplate.html',
  'views/filters/RecipesFiltersView',
  'views/user/UserLoginView',
  'router'
], function($, _, Backbone, Bootstrap, RecipeCollection, SocialSiteView, headerTemplate, RecipesFiltersView, UserLoginView, AppRouter){

  var HeaderView = Backbone.View.extend({
    
	el: $("#header"),
	
	events: {
		'click #search-btn': 'clickSearch',
		'change label input': 'clickFilter'
	},
	
	collection: new RecipeCollection(),
	searchTerm: '',
	
    initialize: function() {
		this.listenTo(UserLoginView.model, 'change:token', this.loginTokenChanged);
    },

    render: function(){
      var compiledTemplate = _.template(headerTemplate);
      this.$el.html(compiledTemplate);
	  this.socialSiteView = new SocialSiteView();
	  this.socialSiteView.setElement(this.$el.find(this.socialSiteView.selector)).render();
	  this.recipesFiltersView = new RecipesFiltersView();
	  this.recipesFiltersView.setElement(this.$el.find(this.recipesFiltersView.selector)).render();
    },
	
	loginTokenChanged: function() {
		var token = UserLoginView.model.get('token');
		if((token != undefined) && (token.length!=0)) {
			$('[data="login"]').css('display', 'none');
			$('[data="logout"]').css('display', '');
		} else {
			$('[data="login"]').css('display', '');
			$('[data="logout"]').css('display', 'none');
		}		
	},
	
	search: function() {
		var url ="#search-recipes/" + this.searchTerm;
		var filter = _.map($('label input:checked'), function(item){return $(item).val()}).join('&');
		url = url + '/' + filter;
		window.location = url;
	},
	
	clickSearch: function() {
		this.searchTerm = $('input[name=query]').val();
		this.search();
	},
	
	clickFilter: function() {
		this.search();
	}

  });

  return HeaderView;
  
});