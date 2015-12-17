'use strict';

// Recipes Edit controller
angular.module('categories').controller('RecipesUpdateCtrl', function ($scope, $state, $localStorage, Recipe, $rootScope, Categories, SubCategories, SubCategoryRecipes, CategoryRecipes, $sce) {



  $scope.getAllCats = function () {
    Categories.query({
      pageId: 999,
      activeFilter: 3 // get all cats
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
      activeFilter: 3 // get all sub cats
    }).$promise.then(function (res) {
      //console.log('Successfullly fetched sub categories11111 :' + JSON.stringify(res))
      if (res.subCatsExist) {
        $scope.subCats = res.subCats;
      } else {
        $scope.getCatRecipes($scope.catSelected.catId);
      }

    }).catch(function (err) {
      //console.log('Error happened : ' + JSON.stringify(err));
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };

  $scope.getCatRecipes = function (CatId) {
    //console.log('$scope.getCatRecipes func is called : ' + CatId);

    CategoryRecipes.query({
      subCatId: CatId,
      pageId: 999
    }).$promise.then(function (res) {
      //console.log('Successfullly fetched category Recipes :' + JSON.stringify(res))
      $scope.subCatRecipes = res.recipes;
      $scope.loading = false;
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
  }


  $scope.getIframeSrc = function (videoId) {
    return $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + videoId)
  }

  $scope.availableTags = ['Chicken', 'Mutton', 'Veg', 'Non-veg', 'Curry', 'Gravy', 'Salads', 'Desserts', 'Cake', 'Sweets', 'Snacks', 'Appetizers', 'Breads', 'Dipping Sides', 'Kids', 'Festival', 'Diwali', 'Ganesh Festival', 'Sankranthi', 'Rakhi', 'Dushera', 'Healthy', 'Soft Drinks', 'Indo chineese', 'South-Indian', 'Soup', 'Chutney', 'Indian Pickels', 'Pregnancy Diet', 'Egg Less', 'Eggs', 'Fruits', 'Prawns'];

  $scope.availableCats = [];
  $scope.availableSubCats = [];


  $scope.getSubCatRecipes = function () {
    $scope.loading = true;
    // console.log('Selected Sub cat for Recipes : ' + JSON.stringify($scope.subCatSelected));
    SubCategoryRecipes.query({
      subCatId: $scope.subCatSelected.subCatId,
      pageId: 999
    }).$promise.then(function (res) {
      //console.log('Successfullly fetched sub category Recipes in recipe update function :' + JSON.stringify(res))
      $scope.subCatRecipes = res.recipes;
      $scope.loading = false;
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

    item.submitted.by = $localStorage.user.displayName;

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


  $scope.deleteRecipe = function (item) {

    //console.log('Recipe bedore state update : ' + JSON.stringify(item));
    item.submitted.by = $localStorage.user.displayName;
    item.state = 1111;
    // console.log('Recipe after state update : ' + JSON.stringify(item));

    Recipe.update({
      vrecipeId: item.recipeId
    }, item, function (res) {
      //console.log('Successfully updated Recipe' + JSON.stringify(res));
      $scope.UpdateMsg = true;
      //$state.go('faqs.dashboard', {});
    }, function (errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  }







})
