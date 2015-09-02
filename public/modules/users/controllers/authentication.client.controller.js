'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', '$localStorage', 'Users', '$state',
 function ($scope, $http, $location, Authentication, $localStorage, Users, $state) {
    $scope.authentication = Authentication;
    // If user is signed in then redirect back home
    //if ($scope.authentication.user) $location.path('/');
    $scope.signup = function () {
      $http.post('/users/signup', $scope.credentials).success(function (response) {
        //console.log('signup client side response ' + JSON.stringify(response));
        if (response.type === false) {
          $scope.error = response.data;
        } else {
          $scope.authentication.user = response;
          $localStorage.token = response.token;
          $location.path('/welcomePage');
        }
      });
    };
    if (navigator.userAgent.match(/Android/i)) {
      //console.log('Android user came');
      //alert('Android user came');
      $scope.androidUser = true;
    } else if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
      $scope.iosUser = true;
    }
    $scope.Login = function () {
      $scope.loading = true;
      //console.log('Login Function is Triggred: ' + JSON.stringify($scope.credentials));
      Users.Login.create($scope.credentials).$promise.then(function (res) {
        console.log('Res after login : ' + JSON.stringify(res));
        if (res.type === false) {
          $scope.errMsg = res.data;
          $scope.loading = false;
        } else {
          $scope.errMsg = false;
          //console.log('User details after login: ' + JSON.stringify(res));
          $localStorage.user = res;
          $localStorage.token = res.token;
          $state.go('reciflix.recipes');
          $scope.loading = false;
        }
      }).catch(function (err) {
        //console.log('Error happened: ' + JSON.stringify(err));
        //console.log('Looks like there is an issue with your connectivity, Please try after sometime!');
      });
    };


}]);
