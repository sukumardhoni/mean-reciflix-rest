'use strict';

//Directive used to set Favorite and Like button

angular.module('recipes')
  .directive('myFavoriteIcon', function ($sce, Authentication, $state, $http, $localStorage, RecipesFavCount, UserFavorites, $modal) {
    return {
      restrict: 'A',
      scope: {
        favorite: '='
      },
      replace: true,
      template: '<i ng-class="emptyIcon ? \'fa fa-heart-o\' : \'fa fa-heart animatedIcon bounceIn\'" style="font-size:20px;padding-left:18%"></i>',
      link: function (scope, elem, attrs) {
        elem.on('click', function () {
          console.log('Recipe favorite dir is called');
          scope.$apply(function () {
            if (Authentication.user) {
              //console.log('Recipe favorite dir is called under Authentication ');
              $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;
              if (scope.favorite) {
                //console.log('Scope .fav Recipe favorite dir is called under Authentication ');
                if (scope.emptyIcon) {
                  console.log('Scope .emptyIcon Recipe favorite dir is called under Authentication ');
                  scope.emptyIcon = false;
                  Authentication.user.favorites.push(scope.favorite.videoId);
                  var favRecipe = scope.favorite;
                  favRecipe.favoritesCount = scope.favorite.favoritesCount + 1;
                  RecipesFavCount.update({
                    recipeId: favRecipe._id
                  }, favRecipe, function (res) {
                    //console.log('Recipe favorite cb');
                  }, function (err) {
                    scope.emptyIcon = true;
                  });
                } else {
                  scope.emptyIcon = true;
                  var favRecipe = scope.favorite;
                  Authentication.user.favorites.splice(Authentication.user.favorites.indexOf(scope.favorite.videoId), 1);
                  favRecipe.favoritesCount = scope.favorite.favoritesCount - 1;
                  RecipesFavCount.update({
                    recipeId: favRecipe._id
                  }, favRecipe, function (res) {
                    //console.log('Recipe Unfavorite cb');
                  }, function (err) {
                    scope.emptyIcon = false;
                  });
                }
                var user = {
                  firstName: Authentication.user.firstName,
                  lastName: Authentication.user.lastName,
                  favorites: scope.favorite.videoId,
                  provider: Authentication.user.provider
                }
                UserFavorites.update({
                  userId: Authentication.user._id
                }, user, function (res) {
                  //console.log('Details User Update fav  Service cb ');
                }, function (err) {
                  //scope.emptyIcon = true;
                });
              } else {
                console.log('It is off!');
              }
            } else {
              var modalInstance = $modal.open({
                templateUrl: 'modules/categories/views/modals/userNotLoggedIn-modal.html',
                backdrop: "static",
                scope: scope,
                controller: 'LoginSignUpModalCtrl'
              });
              modalInstance.result.then(function (booleanValue) {
                scope.modalInstance = $modal.open({
                  templateUrl: 'modules/categories/views/modals/signIn-modal.html',
                  controller: 'AuthenticationController',
                  backdrop: "static",
                  scope: scope,
                  resolve: {
                    SignUpCondition: function () {
                      return booleanValue;
                    }
                  }
                });
              }, function () {});



            }
          })
        });
        scope.$watch('favorite', function (newVal) {
          if (newVal) {
            var user = Authentication.user;
            if (user) {
              if (user.favorites.indexOf(newVal.videoId) == -1) {
                scope.emptyIcon = true;
              } else {
                scope.emptyIcon = false;
              }
            } else {
              scope.emptyIcon = true;
            }
          }
        });
      }
    };
  })


.controller('LoginSignUpModalCtrl', function ($scope, $modalInstance, $modal) {
  $scope.LogInModal = function () {
    $scope.SignUpCondition = false;
    $modalInstance.close();
  };
  $scope.SignUpModal = function () {
    $scope.SignUpCondition = true;
    $modalInstance.close($scope.SignUpCondition);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})


.directive('myLikeIcon', function ($sce, Authentication, $state, $http, $localStorage, RecipesFavCount, UserFavorites, $modal) {
  return {
    restrict: 'A',
    scope: {
      likes: '='
    },
    replace: true,
    template: '<i ng-class=" emptyIcon ? \'fa fa-thumbs-o-up\' : \'fa fa-thumbs-up animatedIcon bounceIn\'" style="font-size:20px"></i>',
    link: function (scope, elem, attrs) {
      elem.on('click', function () {

        // console.log('Recipe likes dir is called');
        scope.$apply(function () {
          if (Authentication.user) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;
            if (scope.likes) {
              if (scope.emptyIcon) {
                scope.emptyIcon = false;
                Authentication.user.likes.push(scope.likes.videoId);
                var favRecipe = scope.likes;
                favRecipe.applikes = scope.likes.applikes + 1;
                RecipesFavCount.update({
                  recipeId: favRecipe._id
                }, favRecipe, function (res) {
                  //console.log('Recipe Liked cb ');
                }, function (err) {
                  scope.emptyIcon = true;
                });
              } else {
                scope.emptyIcon = true;
                var favRecipe = scope.likes;
                Authentication.user.likes.splice(Authentication.user.likes.indexOf(scope.likes.videoId), 1);
                favRecipe.applikes = scope.likes.applikes - 1;
                RecipesFavCount.update({
                  recipeId: favRecipe._id
                }, favRecipe, function (res) {
                  // console.log('Recipe UnLike cb');
                }, function (err) {
                  scope.emptyIcon = false;
                });
              }
              var user = {
                firstName: Authentication.user.firstName,
                lastName: Authentication.user.lastName,
                likes: scope.likes.videoId,
                provider: Authentication.user.provider
              }
              UserFavorites.update({
                userId: Authentication.user._id
              }, user, function (res) {
                //console.log('Details User Update Likes Service cb ');
              }, function (err) {
                scope.emptyIcon = true;
              });
            } else {}
          } else {

            var modalInstance = $modal.open({
              templateUrl: 'modules/categories/views/modals/userNotLoggedIn-modal.html',
              backdrop: "static",
              scope: scope,
              controller: 'LoginSignUpModalCtrl'
            });
            modalInstance.result.then(function (booleanValue) {
              scope.modalInstance = $modal.open({
                templateUrl: 'modules/categories/views/modals/signIn-modal.html',
                controller: 'AuthenticationController',
                backdrop: "static",
                scope: scope,
                resolve: {
                  SignUpCondition: function () {
                    return booleanValue;
                  }
                }
              });
            }, function () {});
          }
        })
      });

      scope.$watch('likes', function (newVal) {
        if (newVal) {
          var user = Authentication.user;
          if (user) {
            if (user.likes.indexOf(newVal.videoId) == -1) {
              scope.emptyIcon = true;
            } else {
              scope.emptyIcon = false;
            }
          } else {
            scope.emptyIcon = true;
          }
        }
      });
    }
  };
})

.directive('popover', function ($compile) {
  return {
    restrict: 'A',
    link: function (scope, elem) {

      var content = $("#popover-content").html();
      var compileContent = $compile(content)(scope);
      var title = $("#popover-head").html();
      var options = {
        content: compileContent,
        html: true,
        title: title,
        'placement': 'top'
      };

      $(elem).popover(options);
    }
  }
})
