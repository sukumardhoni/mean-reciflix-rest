'use strict';

// Recipes Edit controller
angular.module('categories').controller('RecipesUpdateCtrl', function ($scope, $state, $localStorage, $location, $http, Authentication, Recipe, $rootScope) {

  $scope.getAllVideosInfo = function () {
    Recipe.query().$promise.then(function (res) {
      $scope.videosList = res;
      $scope.itemsPerPage = 1;
      $scope.currentPage = 1;
      $scope.maxSize = 5;
      $scope.$watch('currentPage + itemsPerPage', function () {
        $scope.faqSingle = '';
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
          end = begin + $scope.itemsPerPage;
        $scope.finalitems = $scope.videosList.slice(begin, end);
      });
    });
  };


  $scope.pageChanged1 = function () {
    if ($scope.currentPage1 === 1) return;
    $rootScope.pageNumStore1 = $scope.currentPage1;
  };

  $scope.updateRecipeItem = function (item) {
    Recipe.update({
      vrecipeId: item.recipeId
    }, item, function () {
      console.log('Successfully updated Recipe');
      //$state.go('faqs.dashboard', {});
    }, function (errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  }

})

.directive('myYoutube', function ($sce) {
  return {
    restrict: 'EA',
    scope: {
      code: '='
    },
    replace: true,
    template: '<div style="height:300px"><iframe style="overflow:hidden;height:100%;width:70%" controls="0" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
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
