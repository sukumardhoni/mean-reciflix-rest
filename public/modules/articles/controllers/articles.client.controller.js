'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Vrecipes',
 function ($scope, $stateParams, $location, Authentication, Vrecipes) {
    console.log('articals page');

    $scope.authentication = Authentication;

    console.log('type of user ------------' + JSON.stringify($scope.authentication));

    $scope.categories = function () {

      console.log('categories -----------');



    };



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
        console.log("update person function is called");
        //console.log(" seleted in updaterecipes function: " + this.person._id);


        Vrecipes.updaterecipes.update({
          vrecipeId: recipe._id
        }, recipe, function (result) {
          console.log("recipe details Successfully   " + JSON.stringify(result));

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
