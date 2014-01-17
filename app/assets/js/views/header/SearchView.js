define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'router',
  'text!templates/header/searchTemplate.html'
], function($, _, Backbone, Bootstrap, AppRouter, searchTemplate){

  var SearchView = Backbone.View.extend({
    
	// We have 1 for mobile version and 1 for bigger screens
	// We want to query for searchTerm only the relevant one,
	// otherwise, we get empty value.
	el: $(".search-container").not(':hidden'),
	selector: ".search-container",
	
	events: {
		'click #search-btn': 'clickSearch',
		'change label input': 'clickFilter',
		'change input[name=query]': 'searchKeyPress',
		'keyup input[name=query]': 'searchKeyPress'
	},
	
	searchTerm: '',
	
    render: function(){
		var compiledTemplate = _.template(searchTemplate);
		this.$el.html(compiledTemplate);
		return this;
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
		this.trigger('closeMobileMenuEvent');
	},
	
	clickSearch: function() {
		this.searchTerm = $('input[name=query]').val();
		this.search();
	},
	
	clickFilter: function() {
		this.search();
	}

  });

  return SearchView;
  
});