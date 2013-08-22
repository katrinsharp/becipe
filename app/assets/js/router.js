// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'views/home/HomeView',
  'views/signup/SignupThankyouView',
  'views/user/UserLoginView',
  'views/user/UserSignupView',
  'views/user/UserSignupThankyouView',
  'views/user/UserConfirmView',
  'views/recipes/RecipePageView',
  'views/recipes/CreateRecipeView',
  'views/about/AboutUsView',
  'views/header/HeaderView',
  'views/footer/FooterView',
  'text!templates/user/userSignupThankyouTemplate.html',
  'text!templates/user/userSignupCompleteTemplate.html'
], function($, _, Backbone, Cookie, 
	HomeView, 
	SignupThankyouView, 
	UserLoginView, 
	UserSignupView, 
	UserSignupThankyouView, 
	UserConfirmView, 
	RecipePageView,
	CreateRecipeView,
	AboutUsView, 
	HeaderView, 
	FooterView,
	userSignupThankyouTemplate,
	userSignupCompleteTemplate) {

	var initAnalytics = function() {
	
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		  //localhost testing
		  //ga('create', 'UA-40585181-1', {'cookieDomain': 'none'});
		  var url = document.URL;	
		  //if(url.indexOf("becipe.com") != -1 || url.indexOf("becipe-staging.herokuapp.com") != -1) { 
		  if(url.indexOf("becipe.com") != -1) { 
			ga('create', 'UA-40585181-1');
			//DEBUG: ga('create', 'UA-40585181-1', 'none');
		  	var firstVisit = $.cookie('becipe-first-iteration-visit');
			if(firstVisit == undefined) {
				firstVisit = 3;
				$.cookie('becipe-first-iteration-visit', firstVisit, {expires: 720, path: '/'});
			}
		  	//crazy egg
			setTimeout(function(){var a=document.createElement("script");
			var b=document.getElementsByTagName("script")[0];
			a.src=document.location.protocol+"//dnn506yrbagrg.cloudfront.net/pages/scripts/0012/5919.js?"+Math.floor(new Date().getTime()/3600000);
			a.async=true;a.type="text/javascript";b.parentNode.insertBefore(a,b)}, 1);
			//end crazy egg
		  }
		  
	}
  
	var AppRouter = Backbone.Router.extend({
		routes: {
		  '': 'showHome',
		  'search-recipes/(:query)/(:filter)': 'searchRecipes',
		  'create-recipe': 'createRecipe',
		  'user/:action(/:token)': 'userAction',
		  'signup-thankyou/:name': 'signupThankyou',
		  'user-signup-thankyou/:name': 'userSignupThankyou',
		  'user-signup-complete/:name': 'userSignupComplete',
		  'recipe/:id': 'recipeDetails',
		  'about-us': 'aboutUs',
		  // Default
		  '*actions': 'defaultAction'
		}
	});
  
  var initialize = function(){

    var app_router = new AppRouter;
	
	app_router.on('route:showHome', function(){
        var homeView = new HomeView({pageType: 'homepage', query: ''});
    });
	
	app_router.on('route:searchRecipes', function(query, filter){
		if(query==undefined) {
			query = '';
		}
		if(filter==undefined) {
			filter = '';
		}
        var homeView = new HomeView({pageType: 'search', query: query, filter: filter});
		//app_router.navigate('/');
    });
	
	app_router.on('route:userAction', function(action, token){
		if(action=='login') {
			UserLoginView.render();
		} else if(action=='logout') {
			UserLoginView.logout();
		} else if(action=='signup') {
			var userSignupView = new UserSignupView();
			userSignupView.render();
		} else if(action=='confirm') {
			var userConfirmView = new UserConfirmView({token: token});
			userConfirmView.render();
		} else{
			console.log('not implemented yet');
		}
    });
	
	app_router.on('route:signupThankyou', function(name){
        var signupThankyouView = new SignupThankyouView({name: name});
		signupThankyouView.render();
    });
	
	app_router.on('route:userSignupThankyou', function(name){
        var userSignupThankyou = new UserSignupThankyouView({name: name, template: userSignupThankyouTemplate, toSetCookie: false});
		userSignupThankyou.render();
    });
	
	app_router.on('route:userSignupComplete', function(name){
        var userSignupThankyou = new UserSignupThankyouView({name: name, template: userSignupCompleteTemplate, toSetCookie: true});
		userSignupThankyou.render();
    });
	
	app_router.on('route:createRecipe', function(){
        var createRecipeView = new CreateRecipeView();
		createRecipeView.render();
    });
	
	app_router.on('route:recipeDetails', function(id){
        var recipePageView = new RecipePageView({id: id});
		recipePageView.render();
    });
	
	app_router.on('route:aboutUs', function(id){
        var aboutUsView = new AboutUsView();
		aboutUsView.render();
    });
	
    app_router.on('route:defaultAction', function (actions) {
     
		// We have no matching route, lets display the home page 
		// var homeView = new HomeView();
		UserLoginView.render();
    });
	
	initAnalytics();
	var headerView = new HeaderView();
	headerView.render();
    //var footerView = new FooterView();

    Backbone.history.start();
  };
  return { 
    initialize: initialize
  };
});