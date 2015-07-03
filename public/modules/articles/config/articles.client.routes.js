'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
 function ($stateProvider) {
    // Articles state routing
    $stateProvider.
    state('listArticles', {
      url: '/articles',
      templateUrl: 'modules/articles/views/list-articles.client.view.html'
    }).
    state('listArticles.users', {
      url: '/users',
      views: {
        'user.detail': {
          templateUrl: 'modules/articles/views/create-article.client.view.html'
        }
      }
    }).
    state('listArticles.categories', {
      url: '/categories',
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
    });
 }
]);
