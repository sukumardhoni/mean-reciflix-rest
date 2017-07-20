'use strict';

/**
 * Module dependencies.
 */
var StripePayments = require('../../app/controllers/stripePayments.server.controller');


module.exports = function (app) {

	app.route('/prod/api/StripeCharges/newCard')
		.post(StripePayments.newCardPaymentCharges);

	app.route('/prod/api/StripeCharges/savedCard')
		.post(StripePayments.savedCardPaymentCharges);

	app.route('/prod/api/restaurantOrderEmail')
		.post(StripePayments.sendOrderEmail);

	app.route('/prod/api/fcm-push-notifications')
		.post(StripePayments.fcmNotifications);




	app.route('/printerstatus/:printerId/:statusCode')
		.get(StripePayments.printerStatusProd);







	/*qa routes*/




	app.route('/qa/api/StripeCharges/newCard')
		.post(StripePayments.newCardPaymentChargesQA);

	app.route('/qa/api/StripeCharges/savedCard')
		.post(StripePayments.savedCardPaymentChargesQA);

	app.route('/qa/api/restaurantOrderEmail')
		.post(StripePayments.sendOrderEmailQA);

	app.route('/qa/api/fcm-push-notifications')
		.post(StripePayments.fcmNotificationsQA);

	app.route('/qa/printerstatus/:printerId/:statusCode')
		.get(StripePayments.printerStatusQA);


	app.route('/qa/api/fcm-subscribe')
		.post(StripePayments.fcmSubscribeQA);

	app.route('/qa/api/fcm-unsubscribe')
		.post(StripePayments.fcmUnSubscribeQA);

	app.route('/qa/api/fcm-sendNotificationsToTopic')
		.post(StripePayments.sendNotificationsToTopic);

	app.route('/api/aws-register-deviceToken')
		.post(StripePayments.awsRegistrationToken);
	
	app.route('/api/reciflix-aws-notifications-subscribe')
		.post(StripePayments.reciflixAwsNotificationsSubscribe);
	
	app.route('/api/reciflix-aws-notifications-unsubscribe')
		.post(StripePayments.reciflixAwsNotificationsUnSubscribe);
	
	app.route('/api/aws-send-message')
		.post(StripePayments.awsSendMessage);	
	
	app.route('/api/aws-send-message-to-all-devices')
		.post(StripePayments.sendToAllDevices);






};
