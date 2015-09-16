'use strict';

// Recipes Edit controller
angular.module('categories').controller('RecipesUpdateCtrl', function ($scope, $state, $localStorage, Recipe, $rootScope, Categories, SubCategories, SubCategoryRecipes) {



  $scope.getAllCats = function () {
    Categories.query({
      pageId: 999,
      activeFilter: 1 // get only active cats
    }).$promise.then(function (res) {
      $scope.cats = res;
    }).catch(function (err) {
      //console.log('Error happened : ' + JSON.stringify(err));
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };



  $scope.getSubCats = function () {

    //console.log('Selected cat for sub cats : ' + JSON.stringify($scope.catSelected));

    SubCategories.query({
      catId: $scope.catSelected.catId,
      pageId: 999,
      activeFilter: 1 // get only active sub cats
    }).$promise.then(function (res) {
      //console.log('Successfullly fetched sub categories11111 :' + JSON.stringify(res))
      $scope.subCats = res.subCats;
    }).catch(function (err) {
      //console.log('Error happened : ' + JSON.stringify(err));
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };





  $scope.getSubCatRecipes = function (pageNum) {
    //console.log('Selected Sub cat for Recipes : ' + JSON.stringify($scope.subCatSelected));
    SubCategoryRecipes.query({
      subCatId: $scope.subCatSelected.subCatId,
      pageId: 999
    }).$promise.then(function (res) {
      //console.log('Successfullly fetched sub category Recipes :' + JSON.stringify(res))
      $scope.subCatRecipes = res;
      $scope.itemsPerPage = 1;
      $scope.currentPage = 1;
      $scope.maxSize = 5;
      $scope.$watch('currentPage + itemsPerPage', function () {
        $scope.faqSingle = '';
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
          end = begin + $scope.itemsPerPage;
        $scope.finalitems = $scope.subCatRecipes.slice(begin, end);
      });

    }).catch(function (err) {
      //console.log('Error happened : ' + JSON.stringify(err));
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });

  };

  $scope.pageChanged = function () {
    //console.log('Page changed console and current page is : ' + $scope.vm.currentPage);
    //$scope.getSubCatRecipes($scope.vm.currentPage);
    $scope.UpdateMsg = false;
  }

  $scope.updateRecipeItem = function (item) {

    item.submitted.by = $localStorage.user.displayName

    Recipe.update({
      vrecipeId: item.recipeId
    }, item, function () {
      //console.log('Successfully updated Recipe');
      $scope.UpdateMsg = true;
      //$state.go('faqs.dashboard', {});
    }, function (errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  }

})
