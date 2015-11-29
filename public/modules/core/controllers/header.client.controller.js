'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$http', '$location', '$localStorage', '$modal', '$timeout', '$state',
 function ($scope, Authentication, Menus, $http, $location, $localStorage, $modal, $timeout, $state) {
    $scope.authentication = Authentication;
    $scope.authentication.user = $localStorage.user;

    $scope.gotoState = function () {
      if ($scope.authentication.user) {
        $state.go("reciflix.recipes");
      } else {
        $state.go("home");
      }
    }


    $scope.goToSearchRecipes = function (inputQuery) {
      //console.log('goToSearchRecipes is called : ' + inputQuery);
      $state.go("reciflix.recipes.searchedrecipes", {
        query: inputQuery
      });
    }


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


    $scope.OpenSignIn = function () {
      $scope.signFun = true;
      //console.log('Sign In function is called');
      $scope.modalInstance = $modal.open({
        templateUrl: 'modules/categories/views/modals/signIn-modal.html',
        controller: 'AuthenticationController',
        backdrop: "static",
        scope: $scope
      });
      $timeout(function () {
        $scope.signFun = false;
      }, 3000);
    }

    $scope.cancel = function () {
      $scope.modalInstance.dismiss('cancel');
    };

}]);
