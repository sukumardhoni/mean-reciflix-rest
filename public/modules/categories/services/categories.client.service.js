'use strict';

//Categories service used for communicating with the categories REST endpoints
angular.module('categories')

//.constant('API_HOST', 'http://192.168.1.248:3000')
.constant('API_HOST', 'http://localhost:3000')
  //.constant('API_HOST', 'http://www.reciflix.com')


.factory('Categories', function ($resource, API_HOST) {
    //console.log('service Categories -------------- ++++++ ');
    return $resource(API_HOST + '/newcats/page/:pageId/:activeFilter', {
      pageId: '@pageId',
      activeFilter: '@activeFilter'
    }, {
      'query': {
        method: 'GET',
        isArray: true,
        timeout: 20000
      }
    });
  })
  .factory('SingleCat', function ($resource, API_HOST) {
    return $resource(API_HOST + '/newcats/:newCatId', {
      newCatId: '@newCatId'
    }, {
      'save': {
        method: 'POST'
      },
      'get': {
        method: 'GET'
      },
      'update': {
        method: 'PUT'
      },
      'delete': {
        method: 'DELETE'
      }
    });
  })



.factory('SubCategories', function ($resource, API_HOST) {
  return $resource(API_HOST + '/subCats/:catId/:pageId/:activeFilter', {
    catId: '@catId',
    pageId: '@pageId',
    activeFilter: '@activeFilter'
  }, {
    'query': {
      method: 'GET',
      timeout: 20000
    },
    'save': {
      method: 'POST'
    }
  });
})


.factory('SubCat', function ($resource, API_HOST) {
  return $resource(API_HOST + '/singleSubCat/:subCatId', {
    subCatId: '@subCatId'
  }, {
    'update': {
      method: 'PUT'
    },
    'get': {
      method: 'GET'
    },
    'delete': {
      method: 'DELETE'
    }
  });
})

.factory('NotificationFactory', function () {
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "onclick": null,
    "showDuration": "400",
    "hideDuration": "1000",
    "timeOut": "7000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }
  return {
    success: function (msg, title) {
      toastr.success(msg, title);
    },
    error: function (msg, title) {
      toastr.error(msg, title);
    }
  };
})
