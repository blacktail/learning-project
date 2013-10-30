define([
	'lodash',
	'jquery',
	'backbone',
	'handlebars',
	'app',
	'routers',
], function (_, $, Backbone, Handlebars, app, routers, io) {
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
