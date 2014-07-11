define([
  'backbone'
], function(Backbone) {

	var CheckboxModel = Backbone.Model.extend({
	
		el: $('input[type="checkbox"]'),
	
		initialize: function() {
  		}
    });

  	return CheckboxModel;

});