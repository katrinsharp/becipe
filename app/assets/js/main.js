require.config({
  paths: {
    jquery: '../js/external/jquery/jquery-min',//1.7.1
    underscore: '../js/external/underscore/underscore-min', //1.5.0
    backbone: '../js/external/backbone/backbone-min', //1.0.0
	bootstrap: '../js/external/bootstrap/js/bootstrap-min', //2.3.1
	flexslider: '../js/external/flexslider/jquery-flexslider-min', //2.1
	isotope: '../js/external/isotope/jquery-isotope-min', //1.5.12
	moment: '../js/external/moment/moment-min', //date time conversion
	cookie: '../js/external/jquery-cookie/jquery-cookie', //browser cookie helper
	placeholder: '../js/external/jquery-placeholder/jquery-placeholder', //2.0.7
    templates: '../templates' //text.js - 2.0.7
  },
  shim: {
        backbone: {
            deps: ['jquery','underscore'],
            exports: 'Backbone'
        },
		underscore: {
            deps: ['jquery'],
            exports: '_'
        },
		bootstrap: {
            deps: ['jquery'],
            exports: 'Bootstrap'
        },
		flexslider: {
            deps: ['jquery'],
            exports: 'Flexslider'
        },
		isotope: {
            deps: ['jquery'],
            exports: 'Isotope'
        },
		moment: {
			deps: ['jquery'],
            exports: 'Moment'
		},
		cookie: {
			deps: ['jquery'],
            exports: 'Cookie'
		},
		placeholder: {
			deps: ['jquery'],
            exports: 'Placeholder'
		}
    }
});

require([	
  'app'
], function(App){
  App.initialize();
});