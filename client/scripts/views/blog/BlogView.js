define([
  'backbone',
  'globals',
  'views/BaseView',
  'models/user/UserLoginModel',
  'views/blog/BlogCardView',
  'text!templates/blog/blogTemplate.html',
  'text!templates/blog/recentBlogEntriesTemplate.html'
], function(Backbone, globals, BaseView, UserLoginModel, BlogCardView, blogTemplate, recentBlogEntriesTemplate){
  
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
				//var response = _.map(responseRaw, function(item){
				//					item.isLiked=globals.common.isLiked(UserLoginModel, item.id);
				//					return item;
				//				});
				
				var entries = response;
				
				view.$el.html(compiledTemplate({"tags": _.union(_.flatten(_.pluck(response, "tags")))}));
				
				var $container = view.$el.find("#blogentries-container");
				
				_.each(entries, function (itemRaw, i) {
						var item2 = _.extend(itemRaw, globals.recipeHelpers);
						var isLiked = globals.common.isLiked(UserLoginModel, item2.id);
						var item = _.extend(item2, {isLiked: isLiked});
						var blogEntryCard = new BlogCardView(item);
						$container.append(blogEntryCard.render().$el);
					});
				
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