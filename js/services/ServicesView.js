define([
	'lodash',
	'backbone',
	'services/templates',
	'jquery'
], function (_, Backbone, templates, $) {
	console.log(templates);
	var ServicesView = Backbone.View.extend({
		tagName: 'div',

		id: 'servicesPage',

		template: templates.services,

		events: {
			
		},

		initialize: function (options) {
			this.listenTo(this.model, 'change', this.render);

		},

		render: function (model) {
			this.$el.html(this.template(this.model.toJSON()));
			this.$('.section-container').foundation('section', 'reflow');
		}
	});

	return ServicesView;
});
