'use strict';

//Categories service used for communicating with the categories REST endpoints
angular.module('categories').factory('Categories', ['$resource',
 function ($resource) {

    return {
      categoryList: $resource('/newcats/page/:pageId', {
      pageId:'@pageId'
      }, {
        'query': {
          method: 'GET',
          isArray: true
        }
      }),
       newCategory: $resource('/newcats', {}, {
        'save': {
          method: 'POST'
        }
      }),

      editCategory: $resource('/newcats/:newCatId', {newCatId:'@newCatId'}, {
        'get': {
          method: 'GET'
        }
      }),

      updateCategory: $resource('/newcats/:newCatId', {newCatId:'@newCatId'}, {
        'update': {
          method: 'PUT'
        }
      }),


    };


 }
]);
