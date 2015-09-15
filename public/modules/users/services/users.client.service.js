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

//.constant('API_HOST', 'http://localhost:3000')
.constant('API_HOST', 'http://www.reciflix.com')

.factory('Users', ['$resource', 'API_HOST', function ($resource, API_HOST, $localStorage) {
  return {
    Signup: $resource(API_HOST + '/users/signup', {}, {
      create: {
        method: 'POST',
        timeout: 30000
      }
    }),
    Login: $resource(API_HOST + '/users/signin', {}, {
      create: {
        method: 'POST',
        timeout: 20000
      }
    }),
    AllUsers: $resource(API_HOST + '/users/totalUsers', {}, {
      query: {
        method: 'GET',
        isArray: true,
        timeout: 20000
      }
    }),
    UsageDetails: $resource(API_HOST + '/users/usage-details-collection/:pageId', {
      pageId: '@pageId'
    }, {
      query: {
        method: 'GET',
        timeout: 20000
      }
    })
  }
}]);
