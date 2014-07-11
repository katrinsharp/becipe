require.config({
	paths: {
		jquery: '../../bower_components/jquery/dist/jquery',
		underscore: '../../bower_components/underscore/underscore',
		backbone: '../../bower_components/backbone/backbone',
		bootstrap: '../../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap',
		bootstrapeditable: '../../external/bootstrap-editable/bootstrap-editable/js/bootstrap-editable-min', //1.4.6
		select2: '../../external/select2/select2-min', //3.4.2
		poshytip: '../../external/poshytip/jquery-poshytip-min', //1.2
		bootstrapSelect: '../../external/bootstrap-select/bootstrap-select-min', //1.1.2
		bootstrapFileupload: '../../external/bootstrap-fileupload/bootstrap-fileupload-min',
		jqueryForm: '../../bower_components/jquery-form/jquery.form',
		flexslider: '../../external/flexslider/jquery.flexslider',
		isotope: '../../bower_components/isotope/jquery.isotope',
		moment: '../../external/moment/moment-min', //date time conversion
		cookie: '../../external/jquery-cookie/jquery-cookie', //browser cookie helper
		placeholder: '../../bower_components/jquery-placeholder/jquery.placeholder',
		domReady: '../../external/domReady/domReady',//2.0.1
		footable2: '../../external/footable2/js/footable', //2.0.1.1
		autosize: '../../external/autosize/jquery-autosize-min', //1.17.8
		wysihtml5: '../../external/bootstrap-editable/inputs-ext/wysihtml5/bootstrap-wysihtml5-0.0.2/wysihtml5-0.3.0-min',
		bootstrapWysihtml5: '../../external/bootstrap-editable/inputs-ext/wysihtml5/bootstrap-wysihtml5-0.0.2/bootstrap-wysihtml5-0.0.2-min',
		wysihtml5_dep: '../../external/bootstrap-editable/inputs-ext/wysihtml5/wysihtml5',
		consoleShim: '../../external/console-shim/console-shim',
		classie: '../../external/modalwindow/js/classie',
		cssParser: '../../external/modalwindow/js/cssParser',
		cssFiltersPolyfill: '../../external/modalwindow/js/css-filters-polyfill',
		modalEffects: '../../external/modalwindow/js/modalEffects',
		text: '../../bower_components/requirejs-text/text',
		templates: '../templates'
	},
  
	shim: {
		consoleShim : {
			deps: ['jquery'],
            exports: 'consoleShim'
		},
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
		wysihtml5_dep: {
			deps: ['jquery'],
			exports: 'wysihtml5_dep'
		},
		wysihtml5: {
			deps: ['jquery'],
			exports: 'wysihtml5'
		},
		bootstrapWysihtml5: {
			deps: ['jquery', 'wysihtml5_dep', 'wysihtml5'],
			exports: 'bootstrapWysihtml5'
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
		autosize: {
			deps: ['jquery'],
            exports: 'autosize'
		},
		classie: {
			deps: ['jquery'],
            exports: 'classie'
		},
		cssParser: {
			deps: ['jquery'],
            exports: 'cssParser'
		},
		cssFiltersPolyfill: {
			deps: ['jquery'],
            exports: 'cssFiltersPolyfill'
		},
		modalEffects: {
			deps: ['jquery', 'classie', 'cssParser', 'cssFiltersPolyfill'],
            exports: 'modalEffects'
		},
		router: {
			deps: ['auth'],
            exports: 'router'
		}
    }
});

require([	
  'app',
  //'domReady',
  'jquery',
  'backbone',
  'consoleShim'
], function(App, jquery, backbone, consoleShim){
	//domReady(function () {
		//backbone.emulateJSON = true;
		//$.ajaxSetup({
			// Disable caching of AJAX responses */
			//cache: false
		//});
		
		App.initialize();
	//});
});