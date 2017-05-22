'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
 function ($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/home');

		// Home state routing
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'modules/core/views/home.client.view.html',
				data: {
					bodyClass: 'bg-body'
				}
			})
			/*
			      .state('terms', {
			        url: '/terms',
			        templateUrl: 'modules/core/views/terms.client.view.html',
			        module: 'public'
			      })*/
			.state('privacy', {
				url: '/privacy',
				templateUrl: 'modules/core/views/privacy.client.view.html',
				module: 'public',
				data: {
					bodyClass: ''
				}
			});
 }
]).run(function ($rootScope, $state, $stateParams) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
});
