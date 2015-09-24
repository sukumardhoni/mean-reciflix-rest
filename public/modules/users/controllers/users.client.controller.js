'use strict';

angular.module('users')

.controller('UsersCtrl', ['$scope', '$state', 'Users', '$rootScope', function ($scope, $state, Users, $rootScope, $localStorage) {

  var usageCount = 'UC';
  var totalUsersCount = 'TUC';
  var userSuggestions = 'US';


  $scope.getAllUsers = function (pageNum) {
    Users.AllUsers.query({
      pageId: (pageNum - 1) + totalUsersCount
    }).$promise.then(function (res) {
      $scope.users = res.users;
      $scope.itemsPerPage = 5;
      $scope.maxSize = 5;
      $scope.totalItems = res.count;
      if (totalUsersCount === 'TUC')
        totalUsersCount = totalUsersCount + res.count;
      if ($rootScope.pageNumStore > 1) {
        $scope.vm.currentPage = $rootScope.pageNumStore;
        $rootScope.pageNumStore = 1;
      } else {
        $scope.vm = {
          currentPage: 1
        };
      }
    }).catch(function (err) {});
  };


  $scope.getUsageDetails = function (pageNum) {
    Users.UsageDetails.query({
      pageId: (pageNum - 1) + usageCount
    }).$promise.then(function (res) {
      $scope.usageDetails = res.details;
      $scope.totalItems1 = res.count;
      if (usageCount === 'UC')
        usageCount = usageCount + res.count;
      $scope.itemsPerPage1 = 5;
      $scope.maxSize1 = 5;
      if ($rootScope.pageNumStore1 > 1) {
        $scope.vm.currentPage1 = $rootScope.pageNumStore1;
        $rootScope.pageNumStore1 = 1;
      } else {
        $scope.vm = {
          currentPage1: 1
        };
      }
    }).catch(function (err) {
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };

  $scope.pageChanged1 = function () {
    if ($scope.vm.currentPage1 === 1) {
      $scope.getUsageDetails($scope.vm.currentPage1);
    } else {
      $rootScope.pageNumStore1 = $scope.vm.currentPage1;
      $scope.getUsageDetails($scope.vm.currentPage1);
    }
  }

  $scope.pageChanged = function () {
    if ($scope.vm.currentPage === 1) {
      $scope.getAllUsers($scope.vm.currentPage);
    } else {
      $rootScope.pageNumStore = $scope.vm.currentPage;
      $scope.getAllUsers($scope.vm.currentPage);
    }
  };




  $scope.getUsersSuggestions = function (pageNum) {
    Users.UsersSuggestion.query({
      pageId: (pageNum - 1) + userSuggestions
    }).$promise.then(function (res) {
      $scope.suggestions = res.suggestions;
      $scope.totalItems2 = res.count;
      if (userSuggestions === 'US')
        userSuggestions = userSuggestions + res.count;
      $scope.itemsPerPage2 = 5;
      $scope.maxSize2 = 5;
      if ($rootScope.pageNumStore2 > 1) {
        $scope.vm.currentPage2 = $rootScope.pageNumStore2;
        $rootScope.pageNumStore2 = 1;
      } else {
        $scope.vm = {
          currentPage2: 1
        };
      }
    }).catch(function (err) {
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });

  };

  $scope.pageChanged2 = function () {
    if ($scope.vm.currentPage2 === 1) {
      $scope.getUsersSuggestions($scope.vm.currentPage2);
    } else {
      $rootScope.pageNumStore2 = $scope.vm.currentPage2;
      $scope.getUsersSuggestions($scope.vm.currentPage2);
    }
  }
}])
