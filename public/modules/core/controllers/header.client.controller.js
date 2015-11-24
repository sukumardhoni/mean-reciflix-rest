'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$http', '$location', '$localStorage','$modal','$timeout',
 function ($scope, Authentication, Menus, $http, $location, $localStorage,$modal,$timeout) {
    $scope.authentication = Authentication;
    $scope.authentication.user = $localStorage.user;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');

    $scope.toggleCollapsibleMenu = function () {
      console.log('Checking toggleCollapsibleMenu ');
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });


   $scope.OpenSignIn = function(){
     $scope.signFun = true;
     console.log('Sign In function is called');
     $scope.modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/signIn-modal.html',
      controller: 'AuthenticationController',
      backdrop: "static",
      scope: $scope
    });
     $timeout(function () {
       $scope.signFun = false;
        }, 20000);
   }

   $scope.cancel = function () {
    $scope.modalInstance.dismiss('cancel');
  };

 }
]);
