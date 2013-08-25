// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'cookie',
  'globals',
  'auth',
  'models/user/UserLoginModel',
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
], function($, _, Backbone, Cookie, globals, auth,
	UserLoginModel,
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
				firstVisit = globals.currentIteration;
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
	
	var bindAjaxSubmitButton = function() {
		// jQuery Global Setup
		var ajaxMsg = $('button[type="submit"]');
		$(document).bind({
			ajaxStart: function() {
				ajaxMsg.attr('orig-label', ajaxMsg.text()).attr('disabled', 'disabled').text('Submitting...');
				$('span.error').remove();
			},
			ajaxError: function(jqXHR, textStatus, errorThrown) {
				var error = {};
				try{
					error = JSON.parse(textStatus.responseText);
				}catch(e){
					error = {error: textStatus.responseText};
				}
				
				if(_.keys(error).length!=0) {
					var key = _.keys(error)[0];
					if(key=='error') {
						var msg = textStatus.statusText;
						if(msg=='Unauthorized') {
							msg = 'Please login first';
						}
						$('button[type=submit]').before('<div><span class="error">'+msg+'. '+error[key]+'</span></div>');
					} else { //specific field error
						var inField = $('[name='+key+']');
						var errors = $(inField).next('span.error');
						if(errors.length!=0) {
							$(errors).text(error[key]);
						} else {
							$(inField).after('<span class="error">'+error[key]+'</span>');
						}
						$(inField).addClass('error');
					}
				}
				ajaxMsg.attr('class', 'ajax-success').text(ajaxMsg.attr('orig-label')).removeAttr('disabled');
			},
			ajaxDone: function() {
				ajaxMsg.attr('class', 'ajax-success').text(ajaxMsg.attr('orig-label')).removeAttr('disabled');
			}
		});
	}
  
	var AppRouter = Backbone.Router.extend({
		//routes: {
		  //'': 'showHome',
		  //'search-recipes/(:query)/(:filter)': 'searchRecipes',
		  //'create-recipe': 'createRecipe',
		  //'user/:action(/:token)': 'userAction',
		  //'signup-thankyou/:name': 'signupThankyou',
		  //'user-signup-thankyou/:name': 'userSignupThankyou',
		  //'user-signup-complete/:name': 'userSignupComplete',
		  //'recipe/:id': 'recipeDetails',
		  //'about-us': 'aboutUs',
		  // Default
		  //'*actions': 'defaultAction'
		//},
		showHome: function() {
			var homeView = new HomeView({pageType: 'homepage', query: ''});
			homeView.render();
			return homeView;
		},
		searchRecipes: function(query, filter) {
			if(query==undefined) {
			query = '';
			}
			if(filter==undefined) {
				filter = '';
			}
			var homeView = new HomeView({pageType: 'search', query: query, filter: filter});
			homeView.render();
			return homeView;
		},
		createRecipe: function(){
			var createRecipeView = new CreateRecipeView();
			createRecipeView.render();
			return createRecipeView;
		},
		userAction: function(action, token){
			if(action=='login') {
				return (new UserLoginView()).render({backUrl: token});
			} else if(action=='logout') {
				var userLoginView = new UserLoginView();
				userLoginView.logout();
				return userLoginView;
			} else if(action=='signup') {
				var userSignupView = new UserSignupView();
				userSignupView.render();
				return userSignupView;
			} else if(action=='confirm') {
				var userConfirmView = new UserConfirmView({token: token});
				userConfirmView.render();
				return userConfirmView;
			} else{
				console.log('not implemented yet');
			}
		},
		signupThankyou: function(name){
			var signupThankyouView = new SignupThankyouView({name: name});
			signupThankyouView.render();
			return signupThankyouView;
		},
		userSignupThankyou: function(name){
			var userSignupThankyou = new UserSignupThankyouView({name: name, template: userSignupThankyouTemplate, toSetCookie: false});
			userSignupThankyou.render();
			return userSignupThankyou;
		},
		userSignupComplete: function(name){
			var userSignupThankyou = new UserSignupThankyouView({name: name, template: userSignupCompleteTemplate, toSetCookie: true});
			userSignupThankyou.render();
			return userSignupThankyou;
		},
		recipeDetails: function(id){
			var recipePageView = new RecipePageView({id: id});
			recipePageView.render();
			return recipePageView;
		},
		aboutUs: function(){
			var aboutUsView = new AboutUsView();
			aboutUsView.render();
			return aboutUsView;
		},
		defaultAction: function (action) {
			// We have no matching route, lets display the home page 
			return (new UserLoginView()).render();
		},
		authRoutes: {
			'createRecipe': true
			
		},
		route: function(route, name, callback) {
			return Backbone.Router.prototype.route.call(this, route, name, function() {
				//can be used to prefilter any route with given name for example showHome
				//app_router.on("beforeroute:showHome", function() {
				//console.log("Route is about to get hit ...");
				//});
				//this.trigger.apply(this, ['beforeroute:' + name].concat(_.toArray(arguments)));
				if(this.authRoutes[name]&&!UserLoginModel.isAuthenticated()) {
					auth.redirectToLogin();
				}
				if(this.currentView) {
					this.currentView.close();
				}
				this.currentView = callback.apply(this, arguments);
			});
		} 
	});
  
  var initialize = function(){

    var app_router = new AppRouter;
	
	app_router.route('*action', 'defaultAction', app_router.defaultAction);  
	app_router.route('', 'showHome', app_router.showHome);
	app_router.route('search-recipes/(:query)/(:filter)', 'searchRecipes', app_router.searchRecipes);
	app_router.route('create-recipe', 'createRecipe', app_router.createRecipe);
	app_router.route('user/:action(/:token)', 'userAction', app_router.userAction);
	app_router.route('signup-thankyou/:name', 'signupThankyou', app_router.signupThankyou);
	app_router.route('user-signup-thankyou/:name', 'userSignupThankyou', app_router.userSignupThankyou);	
	app_router.route('user-signup-complete/:name', 'showHome', app_router.userSignupComplete);
	app_router.route('recipe/:id', 'showHome', app_router.recipeDetails);
	app_router.route('about-us', 'showHome', app_router.aboutUs);  
		
	initAnalytics();
	bindAjaxSubmitButton();
	var headerView = new HeaderView();
	headerView.render();
    //var footerView = new FooterView();

    Backbone.history.start();
  };
  return { 
    initialize: initialize
  };
});