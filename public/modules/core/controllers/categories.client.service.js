'use strict';

//Categories service used for communicating with the categories REST endpoints
angular.module('categories')


/*provides environment specific API url */
.service('ConfigService', function ($window) {
  if ($window.location.host.match(/reciflix\.com/)) {
    //console.log('its prod: ' + $window.location.host);
    this.API_URL = 'http://www.reciflix.com';
    return this.API_URL;
  } else if ($window.location.host.match(/202.83.31.92\:3000/)) {
    //console.log('its test: ' + $window.location.host);
    this.API_URL = 'http://202.83.31.92:3000';
    return this.API_URL;
  } else {
    //console.log('its dev: ' + $window.location.host);
    this.API_URL = 'http://' + $window.location.host;
    return this.API_URL;
  }
})


//.factory('Categories', function ($resource, API_HOST) {
.factory('Categories', function ($resource, ConfigService) {
    return $resource(ConfigService.API_URL + '/newcats/page/:pageId/:activeFilter', {
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
  .factory('SingleCat', function ($resource, ConfigService) {
    return $resource(ConfigService.API_URL + '/newcats/:newCatId', {
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

.factory('SubCategories', function ($resource, ConfigService) {
  return $resource(ConfigService.API_URL + '/subCats/:catId/:pageId/:activeFilter', {
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


.factory('SubCat', function ($resource, ConfigService) {
  return $resource(ConfigService.API_URL + '/singleSubCat/:subCatId', {
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

.factory('RecipesService', function ($resource, ConfigService) {
  return $resource(ConfigService.API_URL + '/nVRecipes', {}, {
    'save': {
      method: 'POST'
    }
  });
})

.factory('getTopicsService', function ($resource, ConfigService) {
    return $resource('/aws-get-all-topics',{}, {
      'save': {
        method: 'POST',
        isArray: true       
      }
    });
 
  })


  
