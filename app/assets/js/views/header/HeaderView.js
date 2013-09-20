define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'collections/recipes/RecipeCollection',
  'views/social/SocialSiteView',
  'text!templates/header/headerTemplate.html',
  'views/filters/RecipesFiltersView',
  'models/user/UserLoginModel',
  'router'
], function($, _, Backbone, Bootstrap, RecipeCollection, SocialSiteView, headerTemplate, RecipesFiltersView, UserLoginModel, AppRouter){

  var HeaderView = Backbone.View.extend({
    
	el: $("#header"),
	
	events: {
		'click #search-btn': 'clickSearch',
		'change label input': 'clickFilter',
		'change input[name=query]': 'searchKeyPress',
		'keyup input[name=query]': 'searchKeyPress'
	},
	
	collection: new RecipeCollection(),
	searchTerm: '',
	
    initialize: function() {
		this.listenTo(UserLoginModel, 'change:token', this.loginTokenChanged);
    },
	
	//can wait with close since initiated only once

    render: function(){
		var compiledTemplate = _.template(headerTemplate);
		this.$el.html(compiledTemplate);
		this.socialSiteView = new SocialSiteView();
		this.socialSiteView.setElement(this.$el.find(this.socialSiteView.selector)).render();
		this.recipesFiltersView = new RecipesFiltersView();
		this.recipesFiltersView.setElement(this.$el.find(this.recipesFiltersView.selector)).render();
		this.loginTokenChanged();
		return this;
    },
	
	loginTokenChanged: function() {
		var token = UserLoginModel.get('token');
		var fn = UserLoginModel.get('fn');
		var userid = UserLoginModel.get('userid');
		if((token != undefined) && (token.length!=0)) {
			$('[data="login"]').css('display', 'none');
			$('[data="logout"]').css('display', '');
			$('[data="signup"]').css('display', 'none');
			$('[data="user-settings"]').css('display', '').children('a').attr('href', '#user/'+userid+'/profile').text("Hi, "+fn);
		} else {
			$('[data="login"]').css('display', '');
			$('[data="logout"]').css('display', 'none');
			$('[data="signup"]').css('display', '');
			$('[data="user-settings"]').css('display', 'none');
		}		
	},
	
	searchKeyPress: function(e) {
		if (e.keyCode == 13) {
			this.clickSearch();
		}
	},
	
	search: function() {
		var url ="search-recipes/" + this.searchTerm;
		var filter = _.map($('label input:checked'), function(item){return $(item).val()}).join('&');
		url = url + '/' + filter + '//';
		window.location.hash = url;
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