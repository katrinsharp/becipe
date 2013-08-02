// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'views/home/HomeView',
  'views/signup/SignupView',
  'views/signup/SignupThankyouView',
  'views/recipes/RecipePageView',
  'views/about/AboutUsView',
  'views/header/HeaderView',
  'views/footer/FooterView'
], function($, _, Backbone, Cookie, HomeView, SignupView, SignupThankyouView, RecipePageView, AboutUsView, HeaderView, FooterView) {

	var initAnalytics = function() {
	
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		  //localhost testing
		  //ga('create', 'UA-40585181-1', {'cookieDomain': 'none'});
		  var url = document.URL;	
		  if(true || url.indexOf("becipe.com") != -1 || url.indexOf("becipe-staging.herokuapp.com") != -1) { 
			ga('create', 'UA-40585181-1');
			//DEBUG: ga('create', 'UA-40585181-1', 'none');
		  	var firstVisit = $.cookie('becipe-first-iteration-visit');
			if(firstVisit == undefined) {
				firstVisit = 2;
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
		  //'create-recipe': 'signup',
		  //'login': 'signup',
		  'signup': 'signup',
		  'signup-thankyou/:name': 'signupThankyou',
		  'recipe/:id': 'recipeDetails',
		  'about-us': 'aboutUs',
		  // Default
		  '*actions': 'defaultAction'
		}
	});
  
  var initialize = function(){

    var app_router = new AppRouter;
	
	app_router.on('route:showHome', function(){
        var homeView = new HomeView();
    });
	
	app_router.on('route:signup', function(){
        var signupView = new SignupView();
		signupView.render();
    });
	
	app_router.on('route:signupThankyou', function(name){
        var signupThankyouView = new SignupThankyouView({name: name});
		signupThankyouView.render();
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
		var signupView = new SignupView();
		signupView.render();
    });
	
	initAnalytics();

    // Unlike the above, we don't call render on this view as it will handle
    // the render call internally after it loads data. Further more we load it
    // outside of an on-route function to have it loaded no matter which page is
    // loaded initially.
	var headerView = new HeaderView();
    //var footerView = new FooterView();

    Backbone.history.start();
  };
  return { 
    initialize: initialize
  };
});