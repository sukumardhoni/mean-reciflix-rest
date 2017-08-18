'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$modal', '$timeout', 'NotificationFactory', '$localStorage', 'sendNotificationsService', 'SendAwsMsg', 'getTopicsService', 'sendSingleTopicService',
	function ($scope, Authentication, $modal, $timeout, NotificationFactory, $localStorage, sendNotificationsService, SendAwsMsg, getTopicsService, sendSingleTopicService) {


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

			if ($scope.pushNotification.chooseMethod == 'allDevices') {
        console.log('alldevices')
			 	SendAwsMsg.send($scope.pushNotification, function (res) {
          console.log("Succesfully send aws message : " + JSON.stringify(res))
          $scope.pushNotification.msg = ''
				}, function (err) {
					console.log("Error on send aws message")
				}) 
			} else {
        console.log('each topic')
			 	sendSingleTopicService.send($scope.pushNotification, function (res) {
          console.log("Succesfully send aws message : " + JSON.stringify(res))
          $scope.pushNotification.msg = " ";
				}, function (err) {
					console.log("Error on send aws message")
				}) 
			}


		}

		$scope.getTopics = function () {
			$scope.pushNotification.platform = 'android'
			$scope.pushNotification.chooseMethod = 'allDevices'
			console.log("device : " + $scope.pushNotification.platform)
			var platform = {
				platform: $scope.pushNotification.platform
			}
			$scope.topics = [];
			getTopicsService.save(platform, function (result) {
				console.log("Succesfully fteched  topics : " + JSON.stringify(result))
				for (var i = 0; i < result.length; i++) {
					var resTopicName = {
						topicName: result[i].TopicArn.substring(result[i].TopicArn.lastIndexOf(":") + 1),
						topicArn: result[i].TopicArn
					};
					$scope.topics.push(resTopicName)
				}
				console.log('each topic name array ' + JSON.stringify($scope.topics))
			}, function (err) {
				console.log("Error on send aws message")
			})
		}

		$scope.selctedTopic = function (singleTopic) {
			console.log('selctedTopic ' + singleTopic)
		}

		$scope.sendNotifications = function (webNotification) {
			console.log("VVBB@@@ : " + JSON.stringify(webNotification))
			if (webNotification.url) {
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

		}


		// if ('serviceWorker' in navigator && 'PushManager' in window) {
		// 	console.log('Service Worker and Push is supported');

		// 	Notification.requestPermission(function (permission) {
		// 		console.log("request premission : " + JSON.stringify(permission))

		// 		if (Notification.permission === 'granted') {

		// 			var applicationServerPublicKey = 'BCZLs69d4JA_FD9LyXugozgVdBCL1vHwKEBVlaW1M46fLIJ64tC2DWZ33xxr3t5uO8jEPrJCND4Q8LEOFQnxo0g';

		// 			navigator.serviceWorker.register('sw.js').then(function (reg) {
		// 					console.log('Service Worker is registered', reg);

		// 					navigator.serviceWorker.ready.then(function (register) {
		// 						register.pushManager.getSubscription().then(function (userSubscription) {

		// 							function urlB64ToUint8Array(base64String) {
		// 								const padding = '='.repeat((4 - base64String.length % 4) % 4);
		// 								const base64 = (base64String + padding)
		// 									.replace(/\-/g, '+')
		// 									.replace(/_/g, '/');

		// 								const rawData = window.atob(base64);
		// 								const outputArray = new Uint8Array(rawData.length);

		// 								for (var f = 0; f < rawData.length; ++f) {
		// 									outputArray[f] = rawData.charCodeAt(f);
		// 								}
		// 								return outputArray;
		// 							}
		// 							console.log("subscription obj : " + userSubscription)
		// 							if ((userSubscription == undefined) || (userSubscription == null)) {
		// 								console.log("@@user not subscribed")
		// 								var applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
		// 								register.pushManager.subscribe({
		// 									userVisibleOnly: true,
		// 									applicationServerKey: applicationServerKey
		// 								}).then(function (subscription) {
		// 									console.log("user now subscribed to push messages : " + JSON.stringify(subscription))

		// 									WebNotificationSubscription.send(subscription, function sucessCalBck(res) {
		// 										console.log("@##$$$%% Coming to successfull calback : " + JSON.stringify(res))
		// 									}, function errCalBck(err) {
		// 										console.log("@##$$$%% Coming to error calback : " + JSON.stringify(err))
		// 									})

		// 								}).catch(function (error) {
		// 									console.error('error while subscribing', error);
		// 								});

		// 							} else {
		// 								console.log("@@user subscribed")
		// 							}
		// 						})
		// 					})
		// 				})
		// 				.catch(function (error) {
		// 					console.error('Service Worker Error', error);
		// 				});
		// 		}
		// 	})
		// } else {
		// 	console.warn('Push messaging is not supported');
		// }

	}
]);
