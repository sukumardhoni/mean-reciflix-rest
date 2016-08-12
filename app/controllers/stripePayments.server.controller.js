'use strict';

var stripe = require("stripe")("sk_test_REPJYIniwrhDPWfwS8D6yUYv"),
  config = require('../../config/config'),
  firebase = require("firebase");


firebase.initializeApp({
  serviceAccount: config.stripe_info.firebase_serviceAccount,
  databaseURL: config.stripe_info.firebase_databaseURL
})





/**
 * Create a newCardPaymentCharges
 */
exports.newCardPaymentCharges = function (req, res) {
  //console.log('newCardPaymentCharges function is called');
  //console.log('Stripe Body details is : ' + JSON.stringify(req.body));
  var restId = 'affyspremiumgrill';
  //var resAmt = (req.body.amount);
  var chargeAmt = 0;
  var stripeToken = req.body.sToken;

  if (req.body.saveCard) {
    stripe.customers.create({
      source: req.body.sToken,
      description: 'Customers for Affys',
      email: req.body.email
    }).then(function (customer) {
      console.log('successfully created customer : ' + JSON.stringify(customer));
      var firebaseCustObj = {
        uuid: req.body.user_uuid,
        Stripe_Cus_Id: customer.id,
        Card_details: {
          Card_Num: customer.sources.data[0].last4,
          Card_Type: customer.sources.data[0].brand,
          ExpireDate: customer.sources.data[0].exp_month + '/' + customer.sources.data[0].exp_year
        }
      };

      firebase.database().ref('StripeCustomers/' + restId + '/' + firebaseCustObj.uuid).orderByChild("Stripe_Cus_Id").once('value', function (snapshot) {
        var cardExistsKey;
        var details = snapshot.val();
        console.log(' Card stripe customer details is : ' + JSON.stringify(details));
        //.equalTo(firebaseCustObj.Stripe_Cus_Id)
        for (var key in details) {
          console.log(' Key details is  : ' + JSON.stringify(details[key]));
          if ((details[key].Card_details.Card_Num === firebaseCustObj.Card_details.Card_Num) && (details[key].Card_details.Card_Type === firebaseCustObj.Card_details.Card_Type)) {
            cardExistsKey = key;
          }
        }

        if (cardExistsKey) {
          console.log('Already existing card details Update : ' + cardExistsKey);
          firebase.database().ref('StripeCustomers/' + restId + '/' + firebaseCustObj.uuid + '/' + cardExistsKey).update(firebaseCustObj);
        } else {
          console.log('Saving new card to same user  ');
          firebase.database().ref('StripeCustomers/' + restId + '/' + firebaseCustObj.uuid).push(firebaseCustObj);
        }




      });

      firebase.database().ref('Orders/' + restId).orderByChild("orderId").equalTo(req.body.orderId).once('value', function (snapshot) {
          //    console.log('Order details : ', snapshot.val());
          var details = snapshot.val();
          for (var key in details) {
            //    console.log('in for loop');
            chargeAmt = details[key].orderAmt;
            //  console.log('Order chargeAmt is : ' + chargeAmt);
            return stripe.charges.create({
              amount: Math.round(chargeAmt * 100), // amount in cents, again
              currency: "usd",
              customer: customer.id
            });
          }
        })
        //res.jsonp(customer);
    }).then(function (charge) {
      // YOUR CODE: Save the customer ID and other info in a database for later!
      charge.statusCode = 200;
      res.jsonp(charge);
    }, function (err) {
      res.jsonp(err);
      console.log('Error while creating the customer : ' + JSON.stringify(err));
    });
  } else {

    //console.log('Card is not saved card');
    firebase.database().ref('Orders/' + restId).orderByChild("orderId").equalTo(req.body.orderId).once('value', function (snapshot) {
      //console.log('Order details : ', snapshot.val());
      var details = snapshot.val();
      for (var key in details) {
        //console.log('in for loop');
        chargeAmt = details[key].orderAmt;
        //console.log('Order chargeAmt is : ' + chargeAmt);
        if (chargeAmt) {
          //console.log('Charge amount is available : ' + chargeAmt);
          var charge = stripe.charges.create({
            amount: Math.round(chargeAmt * 100), // amount in cents, again
            currency: "usd",
            source: stripeToken,
            description: 'Customers for Affys'
          }, function (err, charge) {
            if (err && err.type === 'StripeCardError') {
              console.log('err charging amount : ' + JSON.stringify(err));
              res.jsonp(err);
            } else {
              charge.statusCode = 200;
              res.jsonp(charge);
            }
          });
        }
      }
    })
  }
};




/**
 * Create a savedCardPaymentCharges
 */
exports.savedCardPaymentCharges = function (req, res) {
  //console.log('savedCardPaymentCharges function is called');
  //console.log('Stripe Body details is : ' + JSON.stringify(req.body));
  //var resAmt = (req.body.amount);
  var restId = 'affyspremiumgrill';
  var chargeAmt = 0;
  firebase.database().ref('Orders/' + restId).orderByChild("orderId").equalTo(req.body.orderId).once('value', function (snapshot) {
    //console.log('Order details : ', snapshot.val());
    var details = snapshot.val();
    for (var key in details) {
      // console.log('in for loop');
      chargeAmt = details[key].orderAmt;
      //console.log('Order chargeAmt is : ' + chargeAmt);
      if (chargeAmt) {
        //console.log('Charge amount is available : ' + chargeAmt);
        stripe.charges.create({
          amount: Math.round(chargeAmt * 100), // amount in cents, again
          currency: "usd",
          customer: req.body.custId // Previously stored, then retrieved
        }).then(function (charge) {
          // YOUR CODE: Save the customer ID and other info in a database for later!
          charge.statusCode = 200;
          res.jsonp(charge);
        }, function (err) {
          console.log('Error while charging from saved card customer : ' + JSON.stringify(err));
          res.jsonp(err);
        });
      }
    }
  })
};
