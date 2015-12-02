'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
 function ($resource) {
    return $resource('users', {}, {
      update: {
        method: 'PUT'
      }
    });
 }
])


.factory('SignUpCondition', function () {
  return false;
})

//API_HOST is taken from single spot category.client.services.js
//.constant('API_HOST', 'http://localhost:3000')
//.constant('API_HOST', 'http://www.reciflix.com')

.factory('Users', ['$resource', 'ConfigService', function ($resource, ConfigService, $localStorage) {
  return {
    Signup: $resource(ConfigService.API_URL + '/users/signup', {}, {
      create: {
        method: 'POST',
        timeout: 30000
      }
    }),
    Login: $resource(ConfigService.API_URL + '/users/signin', {}, {
      create: {
        method: 'POST',
        timeout: 20000
      }
    }),
    AllUsers: $resource(ConfigService.API_URL + '/users/totalUsers/:pageId', {
      pageId: '@pageId'
    }, {
      query: {
        method: 'GET',
        timeout: 20000
      }
    }),
    UsageDetails: $resource(ConfigService.API_URL + '/users/usage-details-collection/:pageId', {
      pageId: '@pageId'
    }, {
      query: {
        method: 'GET',
        timeout: 20000
      }
    }),
    UsersSuggestion: $resource(ConfigService.API_URL + '/users/suggestions/:pageId', {
      pageId: '@pageId'
    }, {
      query: {
        method: 'GET',
        timeout: 20000
      }
    })
  }
}]);
