'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
 function ($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/home');

		// Home state routing
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'modules/core/views/home.client.view.html',
				data: {
					bodyClass: 'bg-body'
				}
			})
			 .state('reciflix.sendWebNotifications', {
        url: 'send-notifications',
        templateUrl: 'modules/core/views/sendNotifications.html',
        controller: 'HomeController'
      })
			/*
			      .state('terms', {
			        url: '/terms',
			        templateUrl: 'modules/core/views/terms.client.view.html',
			        module: 'public'
			      })*/
			.state('privacy', {
				url: '/privacy',
				templateUrl: 'modules/core/views/privacy.client.view.html',
				module: 'public',
				data: {
					bodyClass: ''
				}
			});
 }
]).run(function ($rootScope, $state, $stateParams,WebNotificationSubscription) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
  
if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

    Notification.requestPermission(function (permission) {
      console.log("request premission : " + JSON.stringify(permission))

      if (Notification.permission === 'granted') {

        var applicationServerPublicKey = 'BIA7gT2hX51RX7-ZWGBHsfd0egwvGTQP2Etd_s_a4GXdxRughLZcNcqoa3Q5j_cR73GrI1gDznk0cOqh6JjDUZU';

        navigator.serviceWorker.register('sw.js').then(function (reg) {
            console.log('Service Worker is registered', reg); 

            navigator.serviceWorker.ready.then(function (register) {
              register.pushManager.getSubscription().then(function (userSubscription) {

                function urlB64ToUint8Array(base64String) {
                  const padding = '='.repeat((4 - base64String.length % 4) % 4);
                  const base64 = (base64String + padding)
                    .replace(/\-/g, '+')
                    .replace(/_/g, '/');

                  const rawData = window.atob(base64);
                  const outputArray = new Uint8Array(rawData.length);

                  for (let i = 0; i < rawData.length; ++i) {
                    outputArray[i] = rawData.charCodeAt(i);
                  }
                  return outputArray;
                }
                console.log("subscription obj : " + userSubscription)
                if ((userSubscription == undefined) || (userSubscription == null)) {
                  console.log("@@user not subscribed")
                  var applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
                  register.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: applicationServerKey
                  }).then(function (subscription) {
                    console.log("user now subscribed to push messages : " + JSON.stringify(subscription))

                    WebNotificationSubscription.send(subscription, function sucessCalBck(res) {
                      console.log("@##$$$%% Coming to successfull calback : " + JSON.stringify(res))
                    }, function errCalBck(err) {
                      console.log("@##$$$%% Coming to error calback : " + JSON.stringify(err))
                    })

                  }).catch(function (error) {
                    console.error('error while subscribing', error);
                  });

                } else {
                  console.log("@@user subscribed")
                }
              })
            })
          })
          .catch(function (error) {
            console.error('Service Worker Error', error);
          });
      }
    })
  } else {
    console.warn('Push messaging is not supported');
  }

});
