'use strict';

/**
 * Module dependencies.
 */
var StripePayments = require('../../app/controllers/stripePayments.server.controller');


module.exports = function (app) {

  app.route('/api/StripeCharges/newCard')
    .post(StripePayments.newCardPaymentCharges);

  app.route('/api/StripeCharges/savedCard')
    .post(StripePayments.savedCardPaymentCharges);

  app.route('/api/restaurantOrderEmail')
    .post(StripePayments.sendOrderEmail);

  app.route('/api/fcm-push-notifications')
    .post(StripePayments.fcmNotifications);





  /*qa routes*/


  app.route('/qa/api/StripeCharges/newCard')
    .post(StripePayments.newCardPaymentChargesQA);

  app.route('/qa/api/StripeCharges/savedCard')
    .post(StripePayments.savedCardPaymentChargesQA);

  app.route('/qa/api/restaurantOrderEmail')
    .post(StripePayments.sendOrderEmailQA);

  app.route('/qa/api/fcm-push-notifications')
    .post(StripePayments.fcmNotificationsQA);



};