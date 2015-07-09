'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$state', 'ProspectiveEmail',
 function ($scope, Authentication, $state, ProspectiveEmail) {
    // This provides Authentication context.
    $scope.authentication = Authentication;


    $scope.myint = 1000;
    $scope.slides = [
      {
        image: 'modules/core/img/brand/landing_1.PNG'
    },
      {
        image: 'modules/core/img/brand/landing_2.PNG'
    },
      {
        image: 'modules/core/img/brand/landing_3.png'
    },
      {
        image: 'modules/core/img/brand/landing_4.png'
    },
      {
        image: 'modules/core/img/brand/landing_5.png'
    },
      {
        image: 'modules/core/img/brand/landing_6.png'
    },
      {
        image: 'modules/core/img/brand/landing_7.png'
    },
      {
        image: 'modules/core/img/brand/landing_8.png'
    },
      {
        image: 'modules/core/img/brand/landing_9.png'
    },
      {
        image: 'modules/core/img/brand/landing_10.png'
    },
      {
        image: 'modules/core/img/brand/landing_11.png'
    }

  ];


    $scope.iosShow = function () {
      $scope.errMsg = '';
      $scope.sucessMsg = '';
      console.log('U click on iosShow:');
      ProspectiveEmail.emailGet.query({
        platform: 'ios'
      }, function (data) {
        console.log('particular iosEmails' + JSON.stringify(data));
        $scope.showNotify = data;
      });
    };

    $scope.androidShow = function () {
      $scope.errMsg = '';
      $scope.sucessMsg = '';
      console.log('U click on androidShow:');
      ProspectiveEmail.emailGet.query({
        platform: 'android'
      }, function (data) {
        console.log('particular androidEmails' + JSON.stringify(data));
        $scope.showNotify = data;
      });
    };

    $scope.notifyme = function (platform) {
      console.log('U click on notifyme:' + this.userEmail);
      console.log('U click on platform:' + platform);

      var notifyUser = {
        'platform': platform,
        'email': this.userEmail
      };

      ProspectiveEmail.emailPost.save(notifyUser, function (res) {
        if (res.type === false) {
          console.log('Error console that User already exixts');
          $scope.errMsg = res.data;
        } else {
          console.log('suceess nottify user saved ');
          console.log('suceess nottify user saved ' + JSON.stringify(res));
          $scope.showNotify.count++;
          $scope.userEmail = '';
          $scope.errMsg = '';
          $scope.sucessMsg = 'Your Email id is sucessfully subscribed for ReciFlix App Release Notification';
        }
      }, function (err) {
        console.log('failed to save nottify user' + JSON.stringify(err));
        $scope.errMsg = err.data.message;
        $scope.userEmail = '';
        $scope.sucessMsg = '';
      });



    };



 }
]);
