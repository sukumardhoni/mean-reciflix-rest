'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
 function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/home');

    // Home state routing
    $stateProvider.
    state('reciflix', {
        abstract: true,
        url: '/',
        templateUrl: 'modules/categories/views/common/content.html',
        controller: 'ReciflixCtrl',
      })
      .state('reciflix.home', {
        url: 'home',
       templateUrl: 'modules/core/views/home.client.view.html'
      })
      .state('reciflix.terms', {
        url: 'terms',
        templateUrl: 'modules/core/views/terms.client.view.html',
        module: 'public'
      })
      .state('reciflix.privacy', {
        url: 'privacy',
        templateUrl: 'modules/core/views/privacy.client.view.html',
        module: 'public'
      });
 }
]).run(function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
});
