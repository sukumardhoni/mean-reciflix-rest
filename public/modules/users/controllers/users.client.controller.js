'use strict';

angular.module('users')

.controller('UsersCtrl', ['$scope', '$state', 'Users', '$rootScope', function ($scope, $state, Users, $rootScope) {

  $scope.getAllUsers = function () {
    Users.AllUsers.query().$promise.then(function (res) {
      $scope.users = res;
      $scope.itemsPerPage = 5;
      $scope.maxSize = 5;
      $scope.totalItems = res.length;
      if ($rootScope.pageNumStore > 1) {
        $scope.currentPage = $rootScope.pageNumStore;
        $rootScope.pageNumStore = 1;
      } else {
        $scope.currentPage = 1;
      }
    }).catch(function (err) {});
  };

  $scope.pageChanged = function () {
    if ($scope.currentPage === 1) return;
    $rootScope.pageNumStore = $scope.currentPage;
  };

}])
