'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
 function ($locationProvider) {
    $locationProvider.hashPrefix('!');
 }
]).run(function ($rootScope, $state, $localStorage, $http) {
  var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
  var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
  var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
  var is_safari = navigator.userAgent.indexOf("Safari") > -1;
  var is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
  var browser = '';
  if ((is_chrome) && (is_safari)) {
    browser = 'Chrome';
  } else if ((is_chrome) && (is_opera)) {
    browser = 'Opera';
  } else if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
    browser = 'Safari';
  } else if (is_firefox) {
    browser = 'Firefox';
  } else if (is_explorer) {
    browser = 'Explorer';
  }

  var currentUser = $localStorage.user;

  var userEmail = 'guest';
  if(currentUser){
    userEmail = currentUser.email;
  }


  console.log('$localStorage.user.email is : ' + userEmail);

  $http.defaults.headers.common['Device'] = 'Web,' + browser;
  $http.defaults.headers.common['Email'] = userEmail;

  $rootScope.$state = $state;
  $rootScope.$on('$stateChangeStart',
    function (e, toState, toParams, fromState, fromParams) {
      if (toState.module === 'private' && !$localStorage.user) {
        // If logged out and transitioning to a logged in page:
        e.preventDefault();
        $state.go('signin');
      } else if (toState.module === 'public' && $localStorage.user) {
        // If logged in and transitioning to a logged out page:
        e.preventDefault();
        $state.go('reciflix.recipes');
      };
    });
});

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_') window.location.hash = '#!';

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
