define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'collections/recipes/RecipeCollection',
  'views/social/SocialSiteView',
  'text!templates/header/headerTemplate.html',
  'views/header/MainLinksView',
  'views/header/SearchView',
  'views/filters/RecipesFiltersView',
  'views/filters/RecipesMobileFiltersView',
  'models/user/UserLoginModel',
  'router'
], function($, _, Backbone, Bootstrap, RecipeCollection, SocialSiteView, headerTemplate, MainLinksView, SearchView, RecipesFiltersView, RecipesMobileFiltersView, UserLoginModel, AppRouter){

  var HeaderView = Backbone.View.extend({
    
	el: $("#header"),
	
	events: {
		'click [data-toggle=close-mobile-menu]': 'closeMobileMenu',
		'click [data-toggle=offcanvas]': 'toggleMobileMenu'
	},
	
	collection: new RecipeCollection(),
	searchTerm: '',
	
	closeMobileMenu : function() {
		$('.row-offcanvas').removeClass('active');
		$('#body-container').removeClass('blur-all');
	},
	
	toggleMobileMenu : function() {
		$('.row-offcanvas').toggleClass('active');
		$('#body-container').toggleClass('blur-all');
	},
	
    initialize: function() {
		this.listenTo(UserLoginModel, 'change:token', this.loginTokenChanged);
    },
	
	//can wait with close since initiated only once

    render: function(){
		var compiledTemplate = _.template(headerTemplate);
		this.$el.html(compiledTemplate);
		
		//looking more than the element scope since mobile main links are in the sidebar
		this.mainLinksView = new MainLinksView();
		this.mainLinksView.setElement($(this.mainLinksView.selector)).render();
		this.listenTo(this.mainLinksView, 'closeMobileMenuEvent', this.closeMobileMenu);
		this.searchView = new SearchView();
		this.searchView.setElement($(this.searchView.selector)).render();
		this.listenTo(this.searchView, 'closeMobileMenuEvent', this.closeMobileMenu);
		
		this.socialSiteView = new SocialSiteView();
		this.socialSiteView.setElement(this.$el.find(this.socialSiteView.selector)).render();
		this.recipesFiltersView = new RecipesFiltersView();
		this.recipesFiltersView.setElement(this.$el.find(this.recipesFiltersView.selector)).render();
		this.searchView.listenTo(this.recipesFiltersView, 'clickFilterEvent', this.searchView.onclickFilter);
			
		this.recipesmobileFiltersView = new RecipesMobileFiltersView();
		this.recipesmobileFiltersView.render();
		this.searchView.listenTo(this.recipesmobileFiltersView, 'clickFilterEvent', this.searchView.onclickFilter);
		
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
	}
	
  });

  return HeaderView;
  
});