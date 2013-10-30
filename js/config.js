require.config({
	baseUrl: 'js',
	packages: ['services',
		'common/templates', 'services/templates'
	],
	paths: {
		'jquery': '../vendor/jquery/jquery',
		'lodash': '../vendor/lodash/dist/lodash',
		'backbone': '../vendor/backbone/backbone',
		'handlebars': '../vendor/handlebars/handlebars',
		'foundation': '../vendor/foundation/js/foundation.min',
		'common/partials_compiled': 'common/templates/.auto_partials',
		'common/templates_compiled': 'common/templates/.auto_templates',
		'services/templates_compiled': 'services/templates/.auto_templates'
	},
	shim: {
		'handlebars': {
			exports: 'Handlebars'
		},
		'backbone': {
			deps: ['lodash', 'jquery'],
			exports: 'Backbone'
		},
		'foundation': {
			deps: ['jquery'],
			exports: 'Foundation'
		}
	},

	urlArgs: "bust=" + (new Date()).getTime()
});
