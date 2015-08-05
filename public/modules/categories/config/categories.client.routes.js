'use strict';

// Setting up routes for categories
angular.module('categories').config(['$stateProvider',
 function ($stateProvider) {
    // Categories state routing
    $stateProvider.
    state('listCategories', {
      url: '/categories',
      templateUrl: 'modules/categories/views/list-categories.client.view.html'
      }).
    state('createcategory', {
      url: '/create',
      templateUrl: 'modules/categories/views/create-category.client.view.html'
    }).
    state('editCategory', {
      url: '/editCat/:newCatId',
      templateUrl: 'modules/categories/views/create-category.client.view.html'
    });


/*

    }).
    state('listCategories.category', {
      url: '/category',
      views: {
        'user.categories': {
          templateUrl: 'modules/articles/views/edit-article.client.view.html'
        }
      }
    }).
    state('listArticles.createcategories', {
      url: '/createcategories',
      views: {
        'user.categories': {
          templateUrl: 'modules/articles/views/createcategories.client.view.html'
        }
      }
    }).
    state('listArticles.recipes', {
      url: '/recipes',
      views: {
        'user.recipes': {
          templateUrl: 'modules/articles/views/view-article.client.view.html'
        }
      }
*/
 }
]);
