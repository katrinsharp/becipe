define([
  'backbone',
  'globals',
  'views/BaseView',
  'views/DisqusView',
  'models/blog/BlogEntryModel',
  'text!templates/blog/blogPageTemplate.html',
  'text!templates/blog/recentBlogEntriesTemplate.html',
  'text!templates/recipes/randomRecipesTemplate.html'
], function(Backbone, globals, BaseView, DisqusView, BlogEntryModel, blogPageTemplate, recentBlogEntriesTemplate, randomRecipesTemplate){
  
	var BlogPageView = BaseView.extend({
  
	//el: $("#body-container"),
    
    initialize: function(options) {
		this.model = new BlogEntryModel(options);
		BaseView.prototype.initialize.apply();
    },

    render: function() {
		
		var compiledTemplate = _.template(blogPageTemplate);
		var view = this;
		
		p = this.model.fetch();
		p.error(function () {
			view.displayErrorPage("this blog entry wasn't found");
        });
        p.success(function () {
			var m = view.model;
			view.$el.html(compiledTemplate({blogEntry: m.attributes}));
			$('#body-container').html(view.el);
	
			/*disqus*/
			var identifier = view.model.get('id');
			var url = location.origin + location.pathname + 'disqus/' + location.hash.substr(1, location.hash.length - 1);
			var title = view.model.get('name');
			view.disqusView = new DisqusView({identifier: identifier, url: url, title: title});
			view.disqusView.render();
			/*end of disqus*/
        });
		
		// TODO: Move me to my own view
		
			$.ajax("/api/0.1/recipe/random/8", {
				type: "GET",
				success: function(response) {
					var randomCompiledTemplate = _.template(randomRecipesTemplate);
					var attrs = {"recipes": response};
					_.extend(attrs, globals.recipeHelpers);
					view.$el.find("#random-recipes").html(randomCompiledTemplate(attrs));
				},
				error: function(response) {
					console.log('random recipes: error');
				}
			});
			
			$.ajax("/api/0.1/blog/recent/4", {
				type: "GET",
				success: function(response) {
					var recentCompiledTemplate = _.template(recentBlogEntriesTemplate);
					view.$el.find("#recent-blog-entries").html(recentCompiledTemplate({"blogEntries": response}));
				},
				error: function(response) {
					console.log('recent blog entries: error');
				}
			});
		
		
		//
			
		return this;
	}

  });

  return BlogPageView;
  
});