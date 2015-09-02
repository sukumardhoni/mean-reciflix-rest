'use strict';

// Recipes controller
angular.module('recipes').controller('RecipesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Vrecipes', '$localStorage', '$http',
 function ($scope, $stateParams, $location, Authentication, Vrecipes, $localStorage, $http) {
    //console.log('articals page');


    //console.log('createcategories Title create function is called : ' + $localStorage.token);
    $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;

    $scope.authentication = Authentication;

    //console.log('type of user ------------' + JSON.stringify($scope.authentication));

    $scope.categories = function () {

      //console.log('categories -----------');


      Vrecipes.getcategory.query({

      }, function (res) {


        $scope.categories = res;
        //console.log('list of categories' + JSON.stringify(res));

      });



    };


    $scope.sample = [{
      value: '1',
      name: 'nonveg'
}, {
      value: '2',
      name: 'vegetarian'
}, {
      value: '3',
      name: 'seafood'
}, {
      value: '4',
      name: 'snacks'
}, {
      value: '5',
      name: 'fastfood'
}, {
      value: '6',
      name: 'healthy'
}, {
      value: '7',
      name: 'specials'
}, {
      value: '8',
      name: 'kids'
}, {
      value: '9',
      name: 'beverages'
}, {
      value: '10',
      name: 'regional'
}, {
      value: '11',
      name: 'desserts'
}, {
      id: '12',
      name: 'dairy'
}, {
      id: '13',
      name: 'chutneysoups'
}, {
      value: '14',
      name: 'appetizers'
}, {
      value: '15',
      name: 'kicthentips'
}];






    $scope.createcategories = function () {

      //console.log('createcategories -----------');



      $scope.newcat = function () {



        var categorie = {
          'catId': this.categorie.catId,
          'displayName': this.categorie.displayName,
          'imageName': this.categorie.imageName,

        };
        Vrecipes.savecategory.save(categorie, function (result) {

          /*$scope.persons.push({
            name: result.name,
              _id:result._id
        });*/

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

          //console.log('particular recipeslist' + JSON.stringify(res));
          $scope.recipes = res;
          //console.log('selected item' + JSON.stringify(res));

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

      },

      // Find existing Article
      /*$scope.recipeslist = function () {


        console.log('recipeslist -----------');

        Vrecipes.getrecipes.query({



          },
          function (data) {
            console.log('particular recipeslist' + JSON.stringify(data));
            $scope.recipes = data;


            $scope.totalItems = $scope.recipes.length;
            $scope.itemsPerPage = 1
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
*/

      $scope.updaterecipes = function (recipe) {
        var updatedRecipe = recipe;
        updatedRecipe.submitted.by = 'reciflix_admin';
        updatedRecipe.state = 123;

        Vrecipes.updaterecipes.update({
          vrecipeId: updatedRecipe._id
        }, updatedRecipe, function (result) {

        }, function (err) {
          //console.log('Update recipe error : ' + JSON.stringify(err));

        });
      };

    $scope.removeRecipes = function (recipe) {

      console.log('inside removeRecipes');
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

.controller('RecipesCtrl', function ($scope, $localStorage, $state, Categories, $modal, SingleCat, NotificationFactory) {
  $scope.categoryFun = function () {
    Categories.query({
      pageId: 999
    }).$promise.then(function (res) {
      $scope.categories = res;
    }).catch(function (err) {
      console.log('Error happened : ' + JSON.stringify(err));
      //alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };

  $scope.minimalize = function () {
    $("body").addClass("mini-navbar");
    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {

      // Hide menu in order to smoothly turn on when maximize menu
      $('#side-menu').hide();
      // For smoothly turn on menu
      setTimeout(
        function () {
          $('#side-menu').fadeIn(500);
        }, 100);
    } else if ($('body').hasClass('fixed-sidebar')) {

      $('#side-menu').hide();
      setTimeout(
        function () {
          $('#side-menu').fadeIn(500);
        }, 300);
    } else {
      // Remove all inline style from jquery fadeIn function to reset menu state
      $('#side-menu').removeAttr('style');
    }
  }
})


.controller('SubCategoriesCtrl', function ($scope, $stateParams, SubCategories, $modal, $localStorage) {
  $scope.catName = $stateParams.catName;
  $scope.catId = $stateParams.catId;
  $scope.SubCatName = $stateParams.SubCatName;
  $scope.subCatFun = function () {
    SubCategories.query({
      catId: $stateParams.cat_Id,
      pageId: 999
    }).$promise.then(function (res) {
      console.log('Successfullly fetched sub categories :' + JSON.stringify(res))
      $scope.subCats = res;
    }).catch(function (err) {
      console.log('Error happened : ' + JSON.stringify(err));
      // alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };

})




.controller('SubCategoriesCtrl', function ($scope, $stateParams, SubCategories, $modal, $localStorage) {
  $scope.catName = $stateParams.catName;
  $scope.catId = $stateParams.catId;
  $scope.SubCatName = $stateParams.SubCatName;
  $scope.subCatFun = function () {
    SubCategories.query({
      catId: $stateParams.cat_Id,
      pageId: 999
    }).$promise.then(function (res) {
      console.log('Successfullly fetched sub categories :' + JSON.stringify(res))
      $scope.subCats = res;
    }).catch(function (err) {
      console.log('Error happened : ' + JSON.stringify(err));
      // alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };

})




.controller('SubCatRecipesCtrl', function ($scope, $stateParams, SubCategoryRecipes, $rootScope, Recipe, $sce) {
  $scope.catName = $stateParams.catName;
  $scope.subCatId = $stateParams.subCatId;
  $scope.SubCatName = $stateParams.SubCatName;
  $scope.totalItems = 500;
  $scope.vm = {
    currentPage: 1
  };
  $scope.itemsPerPage = 5;
  $scope.maxSize = 5;

  $scope.recipesUnserSubCat = function (pageNum) {
    SubCategoryRecipes.query({
      subCatId: $stateParams.subCatId,
      pageId: (pageNum - 1)
    }).$promise.then(function (res) {
      console.log('Successfullly fetched sub category Recipes :' + JSON.stringify(res))
      $scope.subCatRecipes = res;
    }).catch(function (err) {
      console.log('Error happened : ' + JSON.stringify(err));
      // alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };

  $scope.pageChanged = function () {
    console.log('Page changed console and current page is : ' + $scope.vm.currentPage);
    $scope.recipesUnserSubCat($scope.vm.currentPage);
  }


  $scope.getSingleRecipe = function () {
    Recipe.get({
      vrecipeId: $stateParams.recipeId
    }).$promise.then(function (res) {
      console.log('Successfullly fetched Recipe :' + JSON.stringify(res))
      $scope.recipe = res;
      $scope.youTubeRecipeURL = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + res.videoId);

    }).catch(function (err) {
      console.log('Error happened : ' + JSON.stringify(err));
      // alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };
});

angular.module('articles').directive('myYoutube', function ($sce) {
  return {
    restrict: 'EA',
    scope: {
      code: '='
    },
    replace: true,
    template: '<div style="height:350px; width:100%"><iframe style="overflow:hidden;height:100%;width:70%" controls="0" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
    link: function (scope) {
      console.log('here');
      scope.$watch('code', function (newVal) {
        if (newVal) {
          scope.url = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + newVal);
        }
      });
    }
  };
});
