'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('recipes')

.constant('API_HOST', 'http://192.168.0.100:3000')
  //.constant('API_HOST', 'http://www.reciflix.com')


.factory('Vrecipes', ['$resource',
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

      savecategory: $resource('/newcategories', {}, {
        'save': {
          method: 'POST'
        },
      }),

    };


 }
])

.factory('SubCategoryRecipes', function ($resource, API_HOST) {
  console.log('service SubCat -------------- ++++++ ');
  return $resource(API_HOST + '/newrecipes/:subCatId/:pageId', {
    subCatId: '@subCatId',
    pageId: '@pageId'
  }, {
    'query': {
      method: 'GET',
      isArray: true,
      timeout: 20000
    }
  });
})


.factory('Recipe', function ($resource, API_HOST) {
  console.log('service SubCat -------------- ++++++ ');
  return $resource(API_HOST + '/vRecipes/:vrecipeId', {
    vrecipeId: '@vrecipeId'
  }, {
    'get': {
      method: 'GET',
      timeout: 20000
    }
  });
})
