'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', '$localStorage', 'Users', '$state', '$modalInstance', 'SignUpCondition',
 function ($scope, $http, $location, Authentication, $localStorage, Users, $state, $modalInstance, SignUpCondition) {
    $scope.authentication = Authentication;
    if ($scope.authentication.user) $state.go('reciflix.recipes');

    if (navigator.userAgent.match(/Android/i)) {
      $scope.androidUser = true;
    } else if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
      $scope.iosUser = true;
    };


    $scope.buttonTextLogIn = 'Log In';
    $scope.buttonTextSignUp = 'Sign Up';
    $scope.condition1 = SignUpCondition;

    $scope.Login = function () {
      $scope.isDisabled = true;
      $scope.buttonTextLogIn = 'Logging In...';
      Users.Login.create($scope.credentials).$promise.then(function (res) {
        if (res.type === false) {
          $scope.errMsg = res.data;
          $scope.isDisabled = false;
          $scope.buttonTextLogIn = 'Log In';
          //$scope.updatingLogo = false;
        } else {
          $scope.errMsg = false;
          $scope.populateUserLocally(res);
        }
      }).catch(function (err) {
        alert('Looks like there is an issue with your connectivity, Please try after sometime!');
      });
    };

    $scope.SignUp = function () {
      $scope.buttonTextSignUp = 'Signing Up...';
      $scope.isDisabled = true;
      Users.Signup.create($scope.user).$promise.then(function (res) {
        if (res.type === false) {
          $scope.errMsg = res.data;
          $scope.isDisabled = false;
          $scope.buttonTextSignUp = 'Sign Up';
          //$scope.updatingLogo = false;
        } else {
          $scope.errMsg = false;
          $scope.populateUserLocally(res);
        }
      }).catch(function (err) {
        alert('Looks like there is an issue with your connectivity, Please try after sometime!');
      });
    };

    hello.init({
      google: '512199517355-keu3sicfllh719ghbveivg6ic40lq4dr.apps.googleusercontent.com',
      facebook: '1607966326154856'
    }, {
      scope: 'email'
    });

    $scope.populateUserLocally = function (respUser) {

      // console.log('Populate local user function , user details : ' + JSON.stringify(respUser));

      //$scope.updatingLogo = false;
      $scope.authentication.user = respUser;
      $localStorage.user = respUser;
      $localStorage.token = respUser.token;
      $scope.modalInstance.close();
      //$state.go('reciflix.recipes');
      if ($state.current.name === 'home') {
        $state.go('reciflix.recipes');
      } else {
        $state.go($state.current)
      }
    };


    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.googleAuthLogIn = function () {
      hello('google').login({
        scope: 'email',
        force: false
      }).then(function (gRes) {
        $http({
            method: "GET",
            url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + gRes.authResponse.access_token,
            data: null,
            dataType: 'json',
          })
          .success(function (data) {
            //console.log('User Profile2222222 is : ' + JSON.stringify(data));
            $scope.gUser = {
              firstName: data.given_name,
              lastName: data.family_name,
              email: data.email,
              provider: 'gmail'
            };
            Users.Signup.create($scope.gUser).$promise.then(function (res) {
              if (res.type === false) {
                $scope.errMsg = res.data;
                $scope.populateUserLocally(res.user);
              } else {
                $scope.errMsg = false;
                $scope.populateUserLocally(res);
              }
            }).catch(function (err) {
              alert('Looks like there is an issue with your connectivity, Please try after sometime!');
            });
          })
          .error(function (data, status) {
            $scope.errMsg = 'This seems to be Google login error. We willl look into it and let you know';
          });
      })
    };

    $scope.fbAuthLogIn = function () {
      hello('facebook').login().then(function (fbRes) {
        $http({
            method: "GET",
            url: 'https://graph.facebook.com/me?access_token=' + fbRes.authResponse.access_token,
            data: null,
            dataType: 'json',
          })
          .success(function (data) {
            //console.log('User Profile2222222 is : ' + JSON.stringify(data));
            $scope.fUser = {
              firstName: data.first_name,
              lastName: data.last_name,
              email: data.email,
              provider: 'fb'
            };
            Users.Signup.create($scope.fUser).$promise.then(function (res) {
              if (res.type === false) {
                $scope.errMsg = res.data;
                $scope.populateUserLocally(res.user);
              } else {
                $scope.errMsg = false;
                $scope.populateUserLocally(res);
              }
            }).catch(function (err) {
              alert('Looks like there is an issue with your connectivity, Please try after sometime!');
            });
          })
          .error(function (data, status) {
            $scope.errMsg = 'This seems to be Google login error. We willl look into it and let you know';
          });
      }, function (e) {
        console.log('Signin error: ' + e.error.message);
      });
    };
}]);
