define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'select2',
  'collections/recipes/RecipeCollection',
  'views/social/SocialSiteView',
  'text!templates/header/headerTemplate.html',
  'views/header/MainLinksView',
  'views/header/SearchView',
  'views/filters/RecipesFiltersView',
  'models/user/UserLoginModel',
  'router'
], function($, _, Backbone, Bootstrap, Select2, RecipeCollection, SocialSiteView, headerTemplate, MainLinksView, SearchView, RecipesFiltersView, UserLoginModel, AppRouter){

  var HeaderView = Backbone.View.extend({
    
	el: $("#header"),
	
	events: {
		'click [data-toggle=close-mobile-menu]': 'closeMobileMenu',
		'click [data-toggle=offcanvas]': 'toggleMobileMenu'
	},
	
	collection: new RecipeCollection(),
	searchTerm: '',
	timer: {},
	
	closeMobileMenu : function() {
		$('.row-offcanvas').removeClass('active');
		$('#body-container').removeClass('blur-all');
	},
	
	toggleMobileMenu : function() {
		$('.row-offcanvas').toggleClass('active');
		$('#body-container').toggleClass('blur-all');
	},
	
	scrollingStopped: function() {
		if(!$(window).scrollTop()) {
			$('.search-footer-container').removeClass('display-none');
		} else {
			$('.search-footer-container').addClass('display-none');
		}
	},
	
    initialize: function() {
		var view = this;
		this.listenTo(UserLoginModel, 'change:token', this.loginTokenChanged);
		$(window).bind('scroll',function () {
			$('.search-footer-container').addClass('display-none');
			clearTimeout(view.timer);
			view.timer = setTimeout(view.scrollingStopped, 150 );
		});
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
		
		$('.selectpicker').selectpicker({
			width: '100%'
		});//('mobile');
		$('button[data-id=categories]').removeClass('btn');
		$('button[data-id=categories]').removeClass('btn-default');
		
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