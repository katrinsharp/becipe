define([
  'backbone',
  'models/misc/CheckboxModel'
], function(Backbone, CheckboxModel) {
	var CheckboxCollection = Backbone.Collection.extend({
		model: CheckboxModel
	});
	
	return CheckboxCollection;

});