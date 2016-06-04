'use strict';


/**
 * Create a PaymentCharges
 */
exports.paymentCharges = function (req, res) {
  console.log('paymentCharges function is called');
  console.log('Stripe Body details is : ' + JSON.stringify(req.body));

  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here https://dashboard.stripe.com/account/apikeys
  var stripe = require("stripe")("sk_test_aiSyv4CZDJogw8tqGkIfizTx");

  // (Assuming you're using express - expressjs.com)
  // Get the credit card details submitted by the form
  var stripeToken = req.body.stripeToken;

  /* var charge = stripe.charges.create({
     amount: req.body.amount * 1000, // amount in cents, again
     currency: "usd",
     source: stripeToken,
     description: "Example charge"
   }, function (err, charge) {
     if (err && err.type === 'StripeCardError') {
       // The card has been declined
     } else {
       res.jsonp(charge);
     }
   });*/



  stripe.customers.create({
    source: stripeToken,
    description: 'info@affyspremiumgrill.com'
  }).then(function (customer) {
    /*return stripe.charges.create({
      amount: req.body.amount * 1000, // amount in cents, again
      currency: "usd",
      customer: customer.id
    });*/

    console.log('successfully created customer : ' + JSON.stringify(customer));
  }).then(function (charge) {
    // YOUR CODE: Save the customer ID and other info in a database for later!
    res.jsonp(charge);
  });








};
