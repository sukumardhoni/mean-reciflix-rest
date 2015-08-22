'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$state', 'ProspectiveEmail',
 function ($scope, Authentication, $state, ProspectiveEmail) {

    $scope.authentication = Authentication;

    if (navigator.userAgent.match(/Android/i)) {
      console.log('Android user came');
      alert('Android user came');
      $scope.androidUser = true;
    } else if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
      $scope.iosUser = true;
    }
 }]);
