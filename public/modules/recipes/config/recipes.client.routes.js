'use strict';

// Setting up route
angular.module('recipes').config(['$stateProvider',
 function ($stateProvider) {
    // Recipes state routing
    $stateProvider.
state('WelcomePage', {
      url: '/welcomePage',
      templateUrl: 'modules/recipes/views/welcome.client.view.html'
    })
 }
]);
