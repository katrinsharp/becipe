define([
  'backbone'
], function(Backbone){

    var DisqusView = Backbone.View.extend({
		
        initialize: function(options) {
			this.identifier = options.identifier;
			this.url = options.url;
			this.title = options.title;
        },

        render: function() {
			var view = this;
			require(['http://becipecom.disqus.com/embed.js'], function(){
				DISQUS.reset({
					reload: true,
					config: function(){
						this.page.identifer = view.identifier;
						this.page.url = view.url;
						this.page.title = view.title;
					}
				});
			});
			return this;
        }
    });

    return DisqusView;
});