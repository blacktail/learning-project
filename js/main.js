define([
	'lodash',
	'jquery',
	'foundation',
	'backbone',
	'handlebars',
	'app',
	'routers',
	'common/templates'
], function (_, $, Foundation, Backbone, Handlebars, app, routers) {
	app.topView = null;

	_.each(routers, function (Router) {
		if (Router && _.isFunction (Router)) {
			new Router();
		}
	});

	Backbone.history.start({
		pushState: false,
		hashChange: true
	});
});
