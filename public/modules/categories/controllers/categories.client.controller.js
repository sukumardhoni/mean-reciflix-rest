'use strict';

// Articles controller
angular.module('categories').controller('CategoryCtrl', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Categories', '$localStorage', '$http',
 function ($scope, $state, $stateParams, $location, Authentication, Categories, $localStorage, $http) {
    $scope.authentication = Authentication;

    $scope.categoryFun = function () {
      //console.log('categoryFun is called');
      Categories.query({
        pageId: 999
      }).$promise.then(function (res) {
        $scope.categories = res;
        //console.log('we r in catagory controller' + JSON.stringify($scope.categories));
      }).catch(function (err) {
        //console.log('Error happened : ' + JSON.stringify(err));
        //alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
      });
    };
 }
])

.controller('ReciflixCtrl', ['$scope', '$state', '$localStorage', '$location', '$http', 'Authentication', function ($scope, $state, $localStorage, $location, $http, Authentication) {
  $scope.authentication = Authentication;
  $scope.userName = $localStorage.user.displayName || 'ReciFlix Admin';
  $scope.localUser = $localStorage.user;

  $scope.signout = function () {
    //console.log('Checking token when we click on sigout : ' + $localStorage.token);
    $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;
    $http.post('/users/signout').success(function (response) {
      console.log(response.data);
      $scope.authentication = '';
      //console.log('before delete:::' + $localStorage.token);
      delete $localStorage.token;
      delete $localStorage.user;
      //console.log('after delete:::' + $localStorage.token);
      $state.go('signin');
    });
  };

}])
