'use strict';

// Setting up routes for categories
angular.module('categories').config(['$stateProvider', '$urlRouterProvider',
 function ($stateProvider, $urlRouterProvider) {
    // Home state routing
    $stateProvider
      .state('reciflix', {
        url: '',
        templateUrl: 'modules/categories/views/common/content.html',
        controller: 'ReciflixCtrl',
        data: {
          bodyClass: ''
        }
      })
      .state('reciflix.recipesUpdate', {
        url: "/recipes/update",
        templateUrl: "modules/categories/views/recipesUpdate.html",
        controller: 'RecipesUpdateCtrl'
      })
      .state('reciflix.categories', {
        url: "/categories",
        templateUrl: "modules/categories/views/categories.html",
        controller: 'CategoryCtrl',
        module: 'private'
      })
      .state('reciflix.categories.subcats', {
        url: "/:catId/subcats",
        views: {
          'child-view': {
            templateUrl: "modules/categories/views/subCats.html",
            controller: 'SubCatCtrl',
          }
        },
        module: 'private'
      })
}])

.run(function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
});
