'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Vrecipes', ['$resource',
 function ($resource) {

    return {

      getrecipes: $resource('/VRecipesByCategoriesForAdmin/:CategoryName', {
        CategoryName: '@CategoryName'
      }, {
        'query': {
          method: 'GET',
          isArray: true
        }
      }),


      updaterecipes: $resource('/vrecipes/:vrecipeId', {
        vrecipeId: '@vrecipeId'
      }, {
        'update': {
          method: 'PUT'
        }
      }),


      getcategory: $resource('/categories/admincats', {}, {
        'query': {
          method: 'GET',
          isArray: true
        }
      }),


      getcategory: $resource('/categories/admincats', {}, {
        'query': {
          method: 'GET',
          isArray: true
        }
      }),


      savecategory: $resource('/newcategories', {}, {
        'save': {
          method: 'POST'
        },
      }),

    }


 }
]);
