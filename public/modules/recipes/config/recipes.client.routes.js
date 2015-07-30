'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
 function ($stateProvider) {
    // Articles state routing
    $stateProvider.
    state('listCategories', {
      url: '/listCategories',
      templateUrl: 'modules/recipes/views/list-categories.client.view.html'
    }).state('Welcome Page', {
      url: '/welcomePage',
      templateUrl: 'modules/recipes/views/welcomePage.client.view.html'
    })
 }
]);
