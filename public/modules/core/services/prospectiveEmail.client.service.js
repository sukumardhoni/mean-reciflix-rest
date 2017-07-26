'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('core').factory('ProspectiveEmail', ['$resource',
 function ($resource) {
    return {
      emailPost: $resource('/ProspectiveEmails', {}, {
        'save': {
          method: 'POST'
        }
      }),
      emailGet: $resource('/ProspectiveEmails/count/:platform', {
        platform: '@platform'
      }, {
        'query': {
          method: 'GET'
        }
      })
    };
  }

])

.factory('WebNotificationSubscription', ['$resource', 'ConfigService',
	function ($resource, ConfigService) {
      return $resource(ConfigService.API_URL + '/add-dataTo-subscriptionDb', {}, {
        send: {
          method: 'POST'
        }
      });
	}
])

  .factory('sendNotificationsService', ['$resource', 'ConfigService',
	function ($resource, ConfigService) {
      return $resource(ConfigService.API_URL + '/send-notificationTo-users', {}, {
        send: {
          method: 'POST'
        }
      });
	}
])

 .factory('SendAwsMsg', ['$resource',
	function ($resource) {
      return $resource('/api/aws-send-message-to-all-devices-reiflix', {}, {
        send: {
          method: 'POST'
        }
      });
	}
])

.factory('sendSingleTopicService', ['$resource',
	function ($resource) {
      return $resource('/api/aws-send-message-to-one-device', {}, {
        send: {
          method: 'POST'
        }
      });
	}
]);
