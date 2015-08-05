'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$http', '$location', '$localStorage',
 function ($scope, Authentication, Menus, $http, $location, $localStorage) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');

    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });


    $scope.signout = function () {
      //console.log('Checking token when we click on sigout : ' + $localStorage.token);
      $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;
      $http.post('/users/signout').success(function (response) {
        console.log(response.data);
        $scope.authentication.user = '';
        console.log('before delete:::' + JSON.stringify($localStorage.token));
        delete $localStorage.token;
        console.log('after delete:::' + JSON.stringify($localStorage.token));
        $location.path('/');
      });
    };
 }
]);
