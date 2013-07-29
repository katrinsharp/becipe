// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/home/HomeView',
  'views/signup/SignupView',
  'views/signup/SignupThankyouView',
  'views/recipes/RecipePageView',
  'views/header/HeaderView',
  'views/footer/FooterView'
], function($, _, Backbone, HomeView, SignupView, SignupThankyouView, RecipePageView, HeaderView, FooterView) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
	  '': 'showHome',
	  //'create-recipe': 'signup',
	  //'login': 'signup',
	  'signup': 'signup',
	  'signup-thankyou/:name': 'signupThankyou',
	  'recipe/:id': "recipeDetails",
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
	
    app_router.on('route:defaultAction', function (actions) {
     
		// We have no matching route, lets display the home page 
		// var homeView = new HomeView();
		var signupView = new SignupView();
		signupView.render();
    });

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