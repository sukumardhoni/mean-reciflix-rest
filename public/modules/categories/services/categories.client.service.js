'use strict';

//Categories service used for communicating with the categories REST endpoints
angular.module('categories')

//.constant('API_HOST', 'http://localhost:3000')
.constant('API_HOST', 'http://www.reciflix.com')


.factory('Categories', function ($resource, API_HOST) {
  console.log('service Categories -------------- ++++++ ');
  return $resource(API_HOST + '/newcats/page/:pageId', {
    pageId: '@pageId'
  }, {
    'query': {
      method: 'GET',
      isArray: true,
      timeout: 20000
    }
  });
})
