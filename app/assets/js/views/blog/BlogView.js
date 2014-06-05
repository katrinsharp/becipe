define([
  'backbone',
  'globals',
  'views/BaseView',
  'text!templates/blog/blogTemplate.html',
  'text!templates/blog/recentBlogEntriesTemplate.html'
], function(Backbone, globals, BaseView, blogTemplate, recentBlogEntriesTemplate){
  
	var BlogView = BaseView.extend({
  
	//el: $("#body-container"),
    
    initialize: function(options) {
		if(options != undefined)
			this.tag = options.tag;
		BaseView.prototype.initialize.apply();
    },

    render: function() {
		
		var compiledTemplate = _.template(blogTemplate);
		var view = this;
		
		var blogUrl = "/api/0.1/blog";
		
		if(this.tag != undefined) {
			blogUrl = blogUrl + "?tag=" + this.tag;
		}
		
		$.ajax(blogUrl, {
			type: "GET",
			success: function(response) {
				
				var entries = _.extend(response, globals.recipeHelpers);
				view.$el.html(compiledTemplate({blogEntries: entries, "tags": _.union(_.flatten(_.pluck(response, "tags")))}));
				$('#body-container').html(view.el);
				
				// TODO: Move me to my own view
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
				
				
			},
			error: function(response) {
				console.log('blog: error');
			}
		});
			
		return this;
	}

  });

  return BlogView;
  
});