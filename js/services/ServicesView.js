define([
	'lodash',
	'backbone',
	'services/templates',
	'jquery'
], function (_, Backbone, templates, $) {
	var EditView = Backbone.View.extend({
		tagName: 'div'
	});

	return EditView;
});
