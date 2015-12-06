'use strict';
angular.module('recipes')

.controller('myFavoritesCtrl', function ($scope, $stateParams, $http, MyFavRecipes, $localStorage, Authentication) {
  $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;
  $scope.authentication = Authentication;
  $scope.vm = {
    currentPage: 1
  };
  $scope.itemsPerPage = 6;
  $scope.maxSize = 5;

  $scope.recipesUnderFavorite = function (pageNum) {
    //$scope.recipes = [];
    $scope.loading = true;
    MyFavRecipes.query({
      pageId: (pageNum - 1),
      uId: Authentication.user._id
    }, function (res) {
      $scope.loading = false;
      //console.log('REsponse of recipesUnderFavorite query is : ' + JSON.stringify(res));
      if (pageNum === 1)
        $scope.totalItems = res.count;
      $scope.recipes = res.recipes;
    })
  }

  $scope.pageChanged = function () {
    $scope.recipesUnderFavorite($scope.vm.currentPage);
  }

});
