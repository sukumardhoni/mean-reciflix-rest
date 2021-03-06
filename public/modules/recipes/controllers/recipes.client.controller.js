'use strict';

// Recipes controller
angular.module('recipes').controller('RecipesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Vrecipes', '$localStorage', '$http',
 function ($scope, $stateParams, $location, Authentication, Vrecipes, $localStorage, $http) {
      $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;
      $scope.authentication = Authentication;
      $scope.categories = function () {
        Vrecipes.getcategory.query({}, function (res) {
          $scope.categories = res;
        });
      };

      $scope.createcategories = function () {
        $scope.newcat = function () {
          var categorie = {
            'catId': this.categorie.catId,
            'displayName': this.categorie.displayName,
            'imageName': this.categorie.imageName,

          };
          Vrecipes.savecategory.save(categorie, function (result) {
            $scope.categorie = '';
          });
        };
      };

      $scope.availableTags = ['Chicken', 'Mutton', 'Veg', 'Non-veg', 'Curry', 'Gravy', 'Salads', 'Desserts', 'Cake', 'Sweets', 'Snacks', 'Appetizers', 'Breads', 'Dipping Sides', 'Kids', 'Festival', 'Diwali', 'Ganesh Festival', 'Sankranthi', 'Rakhi', 'Dushera', 'Healthy', 'Indo chineese', 'South Indian Recipes', 'Soup', 'Chutney', 'Indian Pickels', 'Pregnancy Diet', 'Egg Less', 'SandWhich', 'Fruit', 'Special', 'Hot Drinks', 'Soft Drinks', 'Lunch', 'Break Fast', 'Pasta', 'Ice-Creams', 'Chat', 'Pickle', 'North-Indian', 'Spreads', 'Rice', 'Cashews Special', 'Paratha', 'Chineese', 'Rajasthani', 'Naan', 'Roti', 'Milk', 'Biriyani', 'Pulao', 'Cookies', 'Kitchen Requirements', 'Mushroom', 'Pizza', 'Bakery', 'Chocolates'];


      $scope.availableCats = ['Chicken', 'Mutton', 'Veg', 'nonveg', 'Curry', 'Gravy', 'Salads', 'Desserts', 'Cake', 'Sweets', 'Snacks', 'Appetizers', 'Breads', 'Dipping Sides', 'Kids', 'Festival', 'Diwali', 'Ganesh Festival', 'Sankranthi', 'Rakhi', 'Dushera', 'Healthy', 'Indo chineese', 'South Indian Recipes', 'Soup', 'Chutney', 'Indian Pickels', 'Pregnancy Diet', 'Egg Less', 'SandWhich', 'Fruit', 'Special', 'Hot Drinks', 'Soft Drinks', 'Lunch', 'Break Fast', 'Pasta', 'Ice-Creams', 'Chat', 'Pickle', 'North-Indian', 'Spreads', 'Rice', 'Cashews Special', 'Paratha', 'Chineese', 'Rajasthani', 'Naan', 'Roti', 'Milk', 'Biriyani', 'Pulao', 'Cookies', 'Kitchen Requirements', 'Mushroom', 'Pizza', 'Bakery', 'Chocolates'];



      $scope.selected = function () {

        //console.log('selected item' + this.categoriesname);

        Vrecipes.getrecipes.query({
          CategoryName: this.categoriesname
        }, function (res) {
          $scope.recipes = res;
          $scope.totalItems = $scope.recipes.length;
          $scope.itemsPerPage = 1;
          $scope.currentPage = 1;
          $scope.maxSize = 5;
          $scope.pageCount = function () {
            return Math.ceil($scope.recipes.length / $scope.itemsPerPage);
          };
          $scope.$watch('currentPage + itemsPerPage', function () {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
              end = begin + $scope.itemsPerPage;
            $scope.filteredrecipe = $scope.recipes.slice(begin, end);
          });
        });
      };

      $scope.updaterecipes = function (recipe) {
        var updatedRecipe = recipe;
        updatedRecipe.submitted.by = 'reciflix_admin';
        updatedRecipe.state = 123;
        Vrecipes.updaterecipes.update({
          vrecipeId: updatedRecipe._id
        }, updatedRecipe, function (result) {}, function (err) {
          //console.log('Update recipe error : ' + JSON.stringify(err));
        });
      };

      $scope.removeRecipes = function (recipe) {
        //console.log('inside removeRecipes');
        var updatedRecipe = recipe;
        updatedRecipe.submitted.by = 'reciflix_admin';
        updatedRecipe.state = 333;
        Vrecipes.updaterecipes.update({
          vrecipeId: updatedRecipe._id
        }, updatedRecipe, function (result) {
          //console.log('Remove Recipe details Successfully   ' + JSON.stringify(result));
        }, function (err) {
          //console.log('Update recipe error : ' + JSON.stringify(err));
        });
      };
}])

  .controller('RecipesCtrl', function ($scope, $localStorage, $state, Categories, $modal, SingleCat, NotificationFactory, UserSuggestion, Authentication) {
    $scope.authentication = Authentication;
    $scope.categoryFun = function () {
      if ($state.current.name === 'reciflix.recipes') {
        //console.log('Category function in parent controller');
        $scope.loading = true;
        Categories.query({
          pageId: 999,
          activeFilter: 1 // get only active cats
        }).$promise.then(function (res) {
          $scope.loading = false;
          $scope.categories = res;
        }).catch(function (err) {
          //console.log('Error happened : ' + JSON.stringify(err));
          alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
        });
      }

    };


    $scope.OpenCreateSuggest = function () {
      //console.log('Successfullly fetched Open Model');

      $scope.modalInstance = $modal.open({
        templateUrl: 'modules/categories/views/modals/create-suggestion-modal.html',
        controller: 'RecipesCtrl',
        scope: $scope
      });
    };

    $scope.cancel = function () {
      $scope.modalInstance.dismiss('cancel');
    };


    $scope.createSuggest = function () {
      UserSuggestion.save({
        pageId: 0
      }, $scope.suggest, function (res) {
        //$scope.categories.push(res);
        $scope.modalInstance.close();
        //console.log('Successfullly Saved suggestion ' + JSON.stringify(res));
      }, function (err) {
        console.log('Error occured while creating suggestion, Error details are : ' + JSON.stringify(err));
      });
    };

  })


  .controller('SubCategoriesCtrl', function ($scope, $stateParams, SubCategories, $modal, $localStorage, $state, Authentication) {
    $scope.authentication = Authentication;
    //$scope.catName = $stateParams.catName;
    $scope.catId = $stateParams.catId;
    //$scope.SubCatName = $stateParams.SubCatName;
    $scope.subCatFun = function () {

      if ($stateParams.catId && $state.current.name === 'reciflix.recipes.subcats') {
        //console.log('$stateParams.catId is called : ' + $stateParams.catId);
        $scope.loading = true;
        SubCategories.query({
          catId: $stateParams.catId,
          pageId: 999,
          activeFilter: 1 // get only active sub cats
        }).$promise.then(function (res) {
          //console.log('Successfullly fetched sub categories11111 :' + JSON.stringify(res))
          $scope.loading = false;
          $scope.CatObjWithSubCats = res;
        }).catch(function (err) {
          //console.log('Error happened : ' + JSON.stringify(err));
          alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
        });

      }


    };
  })

  .controller('SubCatRecipesCtrl', function ($scope, $stateParams, SubCategoryRecipes, $rootScope, Recipe, $sce, CategoryRecipes, $state, Authentication, FilterBySubCats, FilterByCatRecipes) {
    $scope.authentication = Authentication;
    $scope.catId = $stateParams.catId;
    $scope.subCatId = $stateParams.subCatId;
    $scope.CatIdForRecipes = $stateParams.CatIdForRecipes;


    $scope.filterByLatestSubCats = {}
    $scope.filterByLatestSubCats.lists1 = [{
        'name': 'Sort by Latest',
        'value': 'published'
        },
      {
        'name': 'Sort by Popular',
        'value': 'none'
        }]
    $scope.filterByLatestSubCats.List1 = $scope.filterByLatestSubCats.lists1[1].value;


    $scope.socialUrl = function (recipesObj) {
      if ($stateParams.subCatId) {
        return 'http://www.reciflix.com/#!/category/' + $stateParams.catId + '/subcats/' + $stateParams.subCatId + '/' + recipesObj.recipeId;
      } else if ($stateParams.CatIdForRecipes) {
        return 'http://www.reciflix.com/#!/category/' + $stateParams.CatIdForRecipes + '/recipes/' + recipesObj.recipeId;
      }
    }

    var pageNumForFilterSubCats = 0;
    var pageNumForFilterCat = 0;

    $scope.recipesFilterByLatest = function (changeValue) {
      if ($stateParams.subCatId) {
        console.log('recipesUnderSubCat is called : ' + changeValue)
        if (changeValue == "published") {
          $scope.showFilterLoadMoreBtn = true;
          // console.log('recipesUnderSubCat is called : ' + changeValue)

          // console.log('$stateParams.subCatId is called : ' + $stateParams.subCatId)
          FilterBySubCats.query({
            subCatId: $stateParams.subCatId,
            pageId: pageNumForFilterSubCats
          }).$promise.then(function (res) {
            // console.log('Successfullly fetched sub category Recipes :' + JSON.stringify(res))
            $scope.loading = false;
            pageNumForFilterSubCats++;
            /*if (pageNum === 1)
              $scope.totalItems = res.recipeCount;*/
            res.catImageUrl = res.subCatsExist ? "https://s3.amazonaws.com/NewRF/" + res.imageName : "https://s3.amazonaws.com/NewRFSubCats/" + res.imageName;
            $scope.subCatRecipesObj = res;
          }).catch(function (err) {
            //console.log('Error happened : ' + JSON.stringify(err));
            alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
          });

        } else if (changeValue == "none") {
          $scope.recipesUnderSubCat();
        }

      } else if ($stateParams.CatIdForRecipes) {
        // console.log('recipesUnderSubCat is called : ' + changeValue)
        // console.log('$stateParams.CatIdForRecipes is called : ' + $stateParams.CatIdForRecipes)
        if (changeValue == "published") {
          $scope.showFilterLoadMoreBtn = true;
          $scope.loading = true;
          FilterByCatRecipes.query({
            subCatId: $stateParams.CatIdForRecipes,
            pageId: pageNumForFilterCat
          }).$promise.then(function (res) {
            //console.log('Successfullly fetched category Recipes :' + JSON.stringify(res))
            pageNumForFilterCat++;
            $scope.loading = false;
            res.catImageUrl = res.subCatsExist ? "https://s3.amazonaws.com/NewRFSubCats/" + res.imageName : "https://s3.amazonaws.com/NewRF/" + res.imageName;
            $scope.subCatRecipesObj = res;
          }).catch(function (err) {
            //console.log('Error happened : ' + JSON.stringify(err));
            alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
          });
        } else if (changeValue == "none") {
          $scope.recipesUnderSubCat();
        }

      }

    }

    /*  $scope.vm = {
        currentPage: 1
      };
      $scope.itemsPerPage = 6;
      $scope.maxSize = 5;*/
    var pageNumSubCat = 0;
    var pageNumCat = 0;

    if ($stateParams.subCatId) {

      $scope.recipesUnderSubCat = function () {
        //console.log('recipesUnderSubCat is called ')
        $scope.showFilterLoadMoreBtn = false;
        $scope.loading = true;
        SubCategoryRecipes.query({
          subCatId: $stateParams.subCatId,
          pageId: pageNumSubCat
        }).$promise.then(function (res) {
          //console.log('Successfullly fetched sub category Recipes :' + JSON.stringify(res))
          $scope.loading = false;
          pageNumSubCat++;
          /*if (pageNum === 1)
            $scope.totalItems = res.recipeCount;*/
          res.catImageUrl = res.subCatsExist ? "https://s3.amazonaws.com/NewRF/" + res.imageName : "https://s3.amazonaws.com/NewRFSubCats/" + res.imageName;
          $scope.subCatRecipesObj = res;
        }).catch(function (err) {
          //console.log('Error happened : ' + JSON.stringify(err));
          alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
        });
      };
    }

    $scope.pageChanged = function () {
      //console.log('Page changed console and current page is : ' + $scope.vm.currentPage);
      $scope.recipesUnderSubCat($scope.vm.currentPage);
    }


    if ($stateParams.CatIdForRecipes) {
      $scope.recipesUnderSubCat = function () {
        $scope.showFilterLoadMoreBtn = false;
        $scope.loading = true;
        CategoryRecipes.query({
          subCatId: $stateParams.CatIdForRecipes,
          pageId: pageNumCat
        }).$promise.then(function (res) {
          //console.log('Successfullly fetched category Recipes :' + JSON.stringify(res))
          pageNumCat++;
          /*if (pageNum === 1)
            $scope.totalItems = res.recipeCount;*/
          $scope.loading = false;
          res.catImageUrl = res.subCatsExist ? "https://s3.amazonaws.com/NewRFSubCats/" + res.imageName : "https://s3.amazonaws.com/NewRF/" + res.imageName;
          $scope.subCatRecipesObj = res;
        }).catch(function (err) {
          //console.log('Error happened : ' + JSON.stringify(err));
          alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
        });
      }

    }

    $scope.getSingleRecipe = function () {

      Recipe.get({
        vrecipeId: $stateParams.recipeId
      }).$promise.then(function (res) {
        // console.log('Successfullly fetched Recipe :' + JSON.stringify(res))
        $scope.singleRecipe = res;
        $scope.youTubeRecipeURL = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + res.videoId + "?rel=0&iv_load_policy=3&amp;controls=1&amp;showinfo=0");

        //https://www.youtube.com/embed/iJUdcbCoIcA?rel=0&amp;controls=1&amp;showinfo=0
      }).catch(function (err) {
        //console.log('Error happened : ' + JSON.stringify(err));
        alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
      });
    };


    $scope.LoadMoreRecipes = function () {

      $scope.spinnerLoading = true;

      //console.log('LoadMoreRecipes is called : ' );
      var onScroll = {};


      if ($stateParams.subCatId) {
        SubCategoryRecipes.query({
          subCatId: $stateParams.subCatId,
          pageId: pageNumSubCat
        }).$promise.then(function (res) {
          // console.log('Successfullly fetched sub category Recipes on loadMore :' + JSON.stringify(res))
          $scope.spinnerLoading = false;
          pageNumSubCat++;
          onScroll = res.recipes;
          if (res.recipes.length == 0) {
            $scope.noMoreRecipesAvailable = true;
          }
          var oldRecipes = $scope.subCatRecipesObj.recipes;
          $scope.subCatRecipesObj.recipes = oldRecipes.concat(onScroll);
        }).catch(function (err) {
          //console.log('Error happened : ' + JSON.stringify(err));
          alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
        });
      }



      if ($stateParams.CatIdForRecipes) {
        CategoryRecipes.query({
          subCatId: $stateParams.CatIdForRecipes,
          pageId: pageNumCat
        }).$promise.then(function (res) {
          $scope.spinnerLoading = false;
          pageNumCat++;
          onScroll = res.recipes;
          if (res.recipes.length == 0) {
            $scope.noMoreRecipesAvailable = true;
            console.log('Recipes Fully fetched there is no more recipes')
          }
          var oldRecipes = $scope.subCatRecipesObj.recipes;
          $scope.subCatRecipesObj.recipes = oldRecipes.concat(onScroll);
        }).catch(function (err) {
          //console.log('Error happened : ' + JSON.stringify(err));
          alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
        });
      }


    }

    $scope.LoadMoreRecipesFromFilterBased = function () {

      console.log("@@#### FILTER FROM LOAD: ")

      $scope.spinnerLoading = true;

      //console.log('LoadMoreRecipes is called : ' );
      var onScroll = {};


      if ($stateParams.subCatId) {
        FilterBySubCats.query({
          subCatId: $stateParams.subCatId,
          pageId: pageNumForFilterSubCats
        }).$promise.then(function (res) {
          // console.log('Successfullly fetched sub category Recipes on loadMore :' + JSON.stringify(res))
          $scope.spinnerLoading = false;
          pageNumForFilterSubCats++;
          onScroll = res.recipes;
          if (res.recipes.length == 0) {
            $scope.noMoreRecipesAvailable = true;
          }
          var oldRecipes = $scope.subCatRecipesObj.recipes;
          $scope.subCatRecipesObj.recipes = oldRecipes.concat(onScroll);
        }).catch(function (err) {
          //console.log('Error happened : ' + JSON.stringify(err));
          alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
        });
      }



      if ($stateParams.CatIdForRecipes) {
        FilterByCatRecipes.query({
          subCatId: $stateParams.CatIdForRecipes,
          pageId: pageNumForFilterCat
        }).$promise.then(function (res) {
          $scope.spinnerLoading = false;
          pageNumForFilterCat++;
          onScroll = res.recipes;
          if (res.recipes.length == 0) {
            $scope.noMoreRecipesAvailable = true;
            console.log('Recipes Fully fetched there is no more recipes')
          }
          var oldRecipes = $scope.subCatRecipesObj.recipes;
          $scope.subCatRecipesObj.recipes = oldRecipes.concat(onScroll);
        }).catch(function (err) {
          //console.log('Error happened : ' + JSON.stringify(err));
          alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
        });
      }


    }



  })
  .controller('SearchedRecipesCtrl', function ($scope, $stateParams, SearchedRecipes, Authentication) {
    $scope.authentication = Authentication;
    $scope.vm = {
      currentPage: 1
    };
    $scope.itemsPerPage = 6;
    $scope.maxSize = 5;
    $scope.searchedQuery = $stateParams.query;

    $scope.recipesUnderSearchQuery = function (pageNum) {
      //console.log('Searched query is : ' + $stateParams.query);

      $scope.loading = true;
      SearchedRecipes.query({
        pageId: (pageNum - 1),
        searchQuery: $stateParams.query
      }, function (res) {
        $scope.loading = false;
        //console.log('REsponse of searched query is : ' + JSON.stringify(res));
        if (pageNum === 1)
          $scope.totalItems = res.count;
        $scope.recipes = res.recipes;
      }, function (err) {
        $scope.loading = false;
        $scope.recipes = [];
      })
    }

    $scope.pageChanged = function () {
      //console.log('Page changed console and current page is : ' + $scope.vm.currentPage);
      $scope.recipesUnderSearchQuery($scope.vm.currentPage);
    }



  });
angular.module('recipes').directive('myYoutube', function ($sce) {
  return {
    restrict: 'EA',
    scope: {
      code: '='
    },
    replace: true,
    template: '<div style="height:350px; width:100%"><iframe style="overflow:hidden;height:100%;width:70%" controls="0" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
    link: function (scope) {
      //console.log('here');
      scope.$watch('code', function (newVal) {
        if (newVal) {
          scope.url = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + newVal);
        }
      });
    }
  };
});
