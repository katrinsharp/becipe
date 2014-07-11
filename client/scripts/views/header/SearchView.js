define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'router',
  'Events',
  'text!templates/header/searchTemplate.html'
], function($, _, Backbone, Bootstrap, AppRouter, Events, searchTemplate){

  var SearchView = Backbone.View.extend({
    
	el: $(".search-container"),
	selector: ".search-container",
	
	events: {
		'click #search-btn': 'clickSearch',
		'change input[name=query]': 'searchKeyPress',
		'keyup input[name=query]': 'searchKeyPress'
	},
	
	searchTerm: '',
	categoriesFilter: '',
	levelFilter: '',
	userFilter: '',
	
    render: function(){
		var compiledTemplate = _.template(searchTemplate);
		this.$el.html(compiledTemplate);
		Events.on('searchResultsCloseEvent', this.onSearchResultsClose, this);
		return this;
    },
	
	searchKeyPress: function(e) {
		if (e.keyCode == 13) {
			this.clickSearch();
		}
	},
	
	search: function(categoriesFilter) {
		var url ="search-recipes/" + this.searchTerm;
		url = url + '/' + this.categoriesFilter + '//' + this.levelFilter;
		window.location.hash = url;
		this.trigger('closeMobileMenuEvent');
	},
	
	clickSearch: function() {
		//assume that there is only one input visible at a time. useful if the browser is resized but not refreshed.
		this.searchTerm = $('input[name=query]').not(':hidden').val();
		this.search();
	},
	
	onclickFilter: function(data) {
		if(data.query != undefined) {
			this.searchTerm = data.query;
		}
		if(data.categories != undefined) {
			this.categoriesFilter = data.categories;
		} 
		if(data.level != undefined) {
			this.levelFilter = data.level;
		}
		if(data.user != undefined) {
			this.userFilter = data.user;
		}
		this.search();
	},
	
	onSearchResultsClose: function() {
		this.$el.find('input[name=query]').val('');
		this.searchTerm = '';
		this.categoriesFilter = '';
		this.levelFilter = '';
		this.userFilter = '';
	}

  });

  return SearchView;
  
});