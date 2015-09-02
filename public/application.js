'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
 function ($locationProvider) {
    $locationProvider.hashPrefix('!');
 }
]).run(function ($rootScope, $state, $localStorage) {
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
