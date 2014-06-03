define([
  'backbone',
  'views/BaseView',
  'views/DisqusView',
  'text!templates/blog/blogPageTemplate.html'
], function(Backbone, BaseView, DisqusView, blogPageTemplate){
  
	var BlogPageView = BaseView.extend({
  
	//el: $("#body-container"),
    
    initialize: function(options) {
		//this.model = new RecipeModel(options);
		BaseView.prototype.initialize.apply();
    },

    render: function() {
		
		var compiledTemplate = _.template(blogPageTemplate);
		var view = this;
	
		
		view.$el.html(compiledTemplate());
		$('#body-container').html(view.el);
	
		/*disqus*/
		var identifier = 'kuku';//view.model.get('id');
		var url = location.origin + location.pathname + 'disqus/' + location.hash.substr(1, location.hash.length - 1);
		var title = 'name';//view.model.get('name');
		view.disqusView = new DisqusView({identifier: identifier, url: url, title: title});
		view.disqusView.render();
		/*end of disqus*/
			
		return this;
	}

  });

  return BlogPageView;
  
});