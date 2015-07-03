'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', '$localStorage',
 function ($scope, $http, $location, Authentication, $localStorage) {
    $scope.authentication = Authentication;
    // If user is signed in then redirect back home
    if ($scope.authentication.user) $location.path('/');
    $scope.signup = function () {
      $http.post('/users/signup', $scope.credentials).success(function (response) {
        console.log('signup client side response ' + JSON.stringify(response));
        if (response.type === false) {
          $scope.error = response.data;
        } else {
          $scope.authentication.user = response;
          $localStorage.token = response.token;
          $location.path('/articles');
        }
      });
    };

    $scope.signin = function () {
      console.log('signin');
      $http.post('/users/signin', $scope.credentials).success(function (response) {
        if (response.type === false) {
          $scope.error = response.data;
        } else {
          console.log('signin client side response :' + JSON.stringify(response));
          $scope.authentication.user = response;
          $localStorage.token = response.token;
          $location.path('/articles');
        }
      });
    };

}]);
