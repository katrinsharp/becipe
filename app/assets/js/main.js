require.config({
  paths: {
    jquery: '../js/external/jquery/jquery-min',//1.7.1
    underscore: '../js/external/underscore/underscore-min', //1.5.0
    backbone: '../js/external/backbone/backbone-min', //1.0.0
	bootstrap: '../js/external/bootstrap/js/bootstrap-min', //2.3.1
	bootstrapeditable: '../js/external/bootstrap-editable/bootstrap-editable/js/bootstrap-editable-min', //1.4.6
	select2: '../js/external/select2/select2-min', //3.4.2
	poshytip: '../js/external/poshytip/jquery-poshytip-min', //1.2
	bootstrapSelect: '../js/external/bootstrap-select/bootstrap-select-min', //1.1.2
	bootstrapFileupload: '../js/external/bootstrap-fileupload/bootstrap-fileupload-min',
	jqueryForm: '../js/external/jquery-form/jquery-form',//3.4
	flexslider: '../js/external/flexslider/jquery-flexslider-min', //2.1
	isotope: '../js/external/isotope/jquery-isotope-min', //1.5.12
	moment: '../js/external/moment/moment-min', //date time conversion
	cookie: '../js/external/jquery-cookie/jquery-cookie', //browser cookie helper
	placeholder: '../js/external/jquery-placeholder/jquery-placeholder', //2.0.7,
	domReady: '../js/external/domReady/domReady',//2.0.1
	footable2: '../js/external/footable2/js/footable', //2.0.1.1
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
		bootstrapeditable: {
			deps: ['jquery'],
            exports: 'BootstrapEditable'
		},
		poshytip: {
			deps: ['jquery'],
            exports: 'Poshytip'
		},
		bootstrapSelect: {
            deps: ['jquery'],
            exports: 'bootstrapSelect'
        },
		bootstrapFileupload: {
            deps: ['jquery'],
            exports: 'bootstrapFileupload'
        },
		jqueryForm: {
            deps: ['jquery'],
            exports: 'jqueryForm'
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
		},
		domReady: {
			deps: ['jquery'],
            exports: 'domReady'
		},
		footable2: {
			deps: ['jquery'],
            exports: 'footable2'
		},
		router: {
			deps: ['auth'],
            exports: 'router'
		}
    }
});

require([	
  'app',
  'domReady'
], function(App, domReady){
	domReady(function () {
		App.initialize();
	});
});