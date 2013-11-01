define([
	'lodash',
	'backbone',
	'services/templates',
	'jquery',
	'app'
], function (_, Backbone, templates, $, app) {
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

			// init services tree
			this.initServiceTree();
			
			
		},

		initServiceTree: function () {
			window.setting = {
				view: {
					showLine: false
				},
				async: {
					enable: true,
					url: app.ajaxBase + "/getServiceNodes",
					autoParam: ["id", "name", "level"],
					contentType: 'application/json',
					type: 'get',
					dataFilter: function (treeId, parentNode, childNodes) {
						if (!childNodes) return null;

						_.each(childNodes, function (node) {
							node.iconSkin = 'lm';
						});

						return childNodes;
					}
				}
			};

			$.fn.zTree.init(this.$("#servTreeCon"), setting);
		}
	});

	return ServicesView;
});
