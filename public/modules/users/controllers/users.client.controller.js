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


  $scope.getUsageDetails = function (pageNum) {
    $scope.getAllUsers();
    //console.log('Successfullly fetched getUsageDetails :' + pageNum)
    Users.UsageDetails.query({
      pageId: (pageNum - 1)
    }).$promise.then(function (res) {
      //console.log('Successfullly fetched getUsageDetails :' + JSON.stringify(res))
      $scope.usageDetails = res.details;
      $scope.totalItems1 = res.count;
      $scope.itemsPerPage1 = 5;
      $scope.maxSize1 = 5;
      if ($rootScope.pageNumStore1 > 1) {
        $scope.currentPage1 = $rootScope.pageNumStore1;
        $rootScope.pageNumStore1 = 1;
      } else {
        $scope.currentPage1 = 1;
      }
    }).catch(function (err) {
      //console.log('Error happened : ' + JSON.stringify(err));
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };

  $scope.pageChanged1 = function () {
    //console.log('Page changed console and current page is : ' + $scope.currentPage1);
    if ($scope.currentPage1 === 1) {
      $scope.getUsageDetails($scope.currentPage1);
    } else {
      $rootScope.pageNumStore1 = $scope.currentPage1;
      //console.log('Page changed console and current page is : ' + $scope.currentPage1);
      $scope.getUsageDetails($scope.currentPage1);
    }
  }

  $scope.pageChanged = function () {
    if ($scope.currentPage === 1) return;
    $rootScope.pageNumStore = $scope.currentPage;
  };

}])
