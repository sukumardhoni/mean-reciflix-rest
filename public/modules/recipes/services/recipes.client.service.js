'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('recipes')

//.constant('API_HOST', 'http://192.168.1.248:3000')
//.constant('API_HOST', 'http://localhost:3000')
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

.factory('SubCategoryRecipes', function ($resource, ConfigService) {
  return $resource(ConfigService.API_URL + '/newrecipes/:subCatId/:pageId', {
    subCatId: '@subCatId',
    pageId: '@pageId'
  }, {
    'query': {
      method: 'GET',
      //isArray: true,
      timeout: 20000
    }
  });
})


.factory('Recipe', function ($resource, ConfigService) {
  return $resource(ConfigService.API_URL + '/nVRecipes/:vrecipeId', {
    vrecipeId: '@vrecipeId'
  }, {
    'get': {
      method: 'GET',
      timeout: 20000
    },
    'save': {
      method: 'POST'
    },
    'update': {
      method: 'PUT'
    },
    'query': {
      method: 'GET',
      isArray: true
    },
    'remove': {
      method: 'DELETE'
    },
    'delete': {
      method: 'DELETE'
    }
  });
})







.factory('UserSuggestion', function ($resource, ConfigService) {
  return $resource(ConfigService.API_URL + '/users/suggestions/:pageId', {
    pageId: '@pageId'
  }, {
    'get': {
      method: 'GET'
    },
    'save': {
      method: 'POST'
    },
    'update': {
      method: 'PUT'
    },
    'query': {
      method: 'GET',
      isArray: true
    },
    'remove': {
      method: 'DELETE'
    },
    'delete': {
      method: 'DELETE'
    }
  });
});
