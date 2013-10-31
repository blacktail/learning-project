define([
	'./ServicesView',
	'app',
	'backbone',
	'jquery'
], function (ServicesView, app, Backbone, $) {
	return function () {
		var model = new Backbone.Model(),
			servicesView = new ServicesView({
				model: model,
			});

		// here we have no data need  to set to model, so, just trigger change event.	
		model.trigger('change');

		$('#main').append(servicesView.el);
		
		app.topView = servicesView;
		console.log('services main.');
	};
});
