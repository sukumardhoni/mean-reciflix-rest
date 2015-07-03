'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Vrecipes', '$localStorage', '$http',
 function ($scope, $stateParams, $location, Authentication, Vrecipes, $localStorage, $http) {
    console.log('articals page');

    $scope.authentication = Authentication;

    console.log('type of user ------------' + JSON.stringify($scope.authentication));

    $scope.categories = function () {

      console.log('categories -----------');


      Vrecipes.getcategory.query({

      }, function (res) {


        $scope.categories = res;
        console.log('list of categories' + JSON.stringify(res));

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

      console.log('createcategories -----------');



      $scope.newcat = function () {
        console.log("add createcategories function");

        console.log('createcategories Title create function is called : ' + $localStorage.token);
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;
        var categorie = {
          'catId': this.categorie.catId,
          'displayName': this.categorie.displayName,
          'imageName': this.categorie.imageName,

        };
        console.log("add createcategories before:" + JSON.stringify(categorie));
        Vrecipes.savecategory.save(categorie, function (result) {
          console.log("add categorie after:" + JSON.stringify(result));
          console.log("add categorie after:");
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

        console.log('selected item' + this.categoriesname);

        Vrecipes.getrecipes.query({
          CategoryName: this.categoriesname

        }, function (res) {

          console.log('particular recipeslist' + JSON.stringify(res));
          $scope.recipes = res;
          console.log('selected item' + JSON.stringify(res));

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
          console.log("Update recipe details Successfully   ");

        }, function (err) {
          console.log("Update recipe error : " + JSON.stringify(err));

        });
      };

    $scope.removeRecipes = function (recipe) {
      var updatedRecipe = recipe;
      updatedRecipe.submitted.by = 'reciflix_admin';
      updatedRecipe.state = 333;

      Vrecipes.updaterecipes.update({
        vrecipeId: updatedRecipe._id
      }, updatedRecipe, function (result) {
        console.log("Remove Recipe details Successfully   " + JSON.stringify(result));

      }, function (err) {
        console.log("Update recipe error : " + JSON.stringify(err));

      });
    };









 }
]);


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
          scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal);
        }
      });
    }
  };
});
