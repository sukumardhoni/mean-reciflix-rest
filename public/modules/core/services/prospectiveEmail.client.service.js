'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('core').factory('ProspectiveEmail', ['$resource',
 function ($resource) {
    return {
      emailPost: $resource('/ProspectiveEmails', {}, {
        'save': {
          method: 'POST'
        }
      }),


      emailGet: $resource('/ProspectiveEmails/:platform', {
        platform: '@platform'
      }, {
        'query': {
          method: 'GET',
          isArray: true
        }
      })

    }
  }

]);
