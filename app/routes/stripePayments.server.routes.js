'use strict';

/**
 * Module dependencies.
 */
var StripePayments = require('../../app/controllers/stripePayments.server.controller');


module.exports = function (app) {

  app.route('/api/StripeCharges/:StripeToken')
    .post(StripePayments.paymentCharges);


};
