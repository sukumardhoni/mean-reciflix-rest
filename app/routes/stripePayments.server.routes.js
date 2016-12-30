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


};
