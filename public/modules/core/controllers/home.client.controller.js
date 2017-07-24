'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$modal', '$timeout', 'NotificationFactory', '$localStorage','sendNotificationsService','SendAwsMsg',
 function ($scope, Authentication, $modal, $timeout, NotificationFactory, $localStorage,sendNotificationsService,SendAwsMsg) {


    if (!$localStorage.reciflix_visited) {
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {

      } else {
        NotificationFactory.success('Browse All Yummy Recipes here...', 'Welcome to ReciFlix');
      }


      $localStorage.reciflix_visited = true;
    }

    $scope.authentication = Authentication;

    if (navigator.userAgent.match(/Android/i)) {
      //console.log('Android user came');
      //alert('Android user came');
      $scope.androidUser = true;
    } else if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
      $scope.iosUser = true;
    }


    $scope.OpenSignIn = function () {
      $scope.signFun = true;
      //console.log('Sign In function is called');
      $scope.modalInstance = $modal.open({
        templateUrl: 'modules/categories/views/modals/signIn-modal.html',
        controller: 'AuthenticationController',
        backdrop: "static",
        scope: $scope
      });
      $timeout(function () {
        $scope.signFun = false;
      }, 3000);
    }

    $scope.cancel = function () {
      $scope.modalInstance.dismiss('cancel');
    };

       $scope.pushNotification = {
      platform: false
    }
    $scope.pushnotification = function () {
      console.log("PUSH NOTIFICATIONS :" + JSON.stringify($scope.pushNotification))

      SendAwsMsg.send($scope.pushNotification, function (res) {
        console.log("Succesfully send aws message : " + JSON.stringify(res))
      }, function (err) {
        console.log("Error on send aws message")
      })


    }

 $scope.sendNotifications = function (webNotification) {
      console.log("VVBB@@@ : " + JSON.stringify(webNotification))
      var notificationObj = {
        title: webNotification.title,
        message: webNotification.msg,
        icon: 'https://lh3.googleusercontent.com/BCOE0vqCfr8aqpIKEF7QEt-qa7p8I7KDg58Juz6M6_YGb4l7phrO2vMvi_SDy10ucQ=w300',
        url: webNotification.url
      }

      sendNotificationsService.send(notificationObj, function sucsCalBck(res) {
        console.log("successfull calback : " + JSON.stringify(res))
        $scope.webNotification = {};
      }, function errCalBck(err) {
        console.log("error of sending notification : " + JSON.stringify(err))
      })
    }


 }]).directive('showButton', ['webNotification', function (webNotification) {
return {
    restrict: 'C',
    scope: {
      notificationTitle: '=',
      notificationMsg: '=',
      notificationUrl: '='
    },
    link: function (scope, element) {
      console.log("coming to directive notifications")
      element.on('click', function onClick() {
        console.log("coming to directive notifications click")

        if ((scope.notificationTitle) && (scope.notificationMsg)) {
          var notification = new Notification(scope.notificationTitle, {
            body: scope.notificationMsg,
            icon: 'https://lh3.googleusercontent.com/BCOE0vqCfr8aqpIKEF7QEt-qa7p8I7KDg58Juz6M6_YGb4l7phrO2vMvi_SDy10ucQ=w300'

          });


          notification.onclick = function () {
            console.log("####")
             window.open(scope.notificationUrl, '_blank')
          }
          setTimeout(function () {
            notification.close();
          }, 5000);

          /*  webNotification.showNotification(scope.notificationTitle, {
              body: scope.notificationMsg,
              icon: 'https://lh3.googleusercontent.com/BCOE0vqCfr8aqpIKEF7QEt-qa7p8I7KDg58Juz6M6_YGb4l7phrO2vMvi_SDy10ucQ=w300',
              onClick: function onNotificationClicked() {
                console.log('Notification clicked.');
                window.open(scope.notificationUrl, '_blank')
              },
              autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
            }, function onShow(error, hide) {
              if (error) {
                window.alert('Unable to show notification: ' + error.message);
              } else {
                console.log('Notification Shown.');

                setTimeout(function hideNotification() {
                  console.log('Hiding notification....');
                  hide(); //manually close the notification (you can skip this if you use the autoClose option)
                }, 5000);
              }
            });*/
        }
      });
    }
  };
}]);
