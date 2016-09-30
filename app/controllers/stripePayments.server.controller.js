'use strict';

var config = require('../../config/config'),
  stripe = require("stripe")(config.stripe_info.affys_secret_key),
  agenda = require('../../schedules/job-schedule.js')(config.db),
  firebase = require("firebase");


/*firebase.initializeApp({
  serviceAccount: config.stripe_info.firebase_serviceAccount,
  databaseURL: config.stripe_info.firebase_databaseURL
})*/

firebase.initializeApp(config.firebase_info);





/**
 * Create a newCardPaymentCharges
 */
exports.newCardPaymentCharges = function (req, res) {
  //console.log('newCardPaymentCharges function is called');
  //console.log('Stripe Body details is : ' + JSON.stringify(req.body));
  var restId = req.body.restId;
  //var resAmt = (req.body.amount);
  var chargeAmt = 0;
  var stripeToken = req.body.sToken;

  if (req.body.saveCard) {
    firebase.database().ref('Orders/' + restId).orderByChild("orderId").equalTo(req.body.orderId).once('value', function (snapshot) {
      console.log('Order details : ', snapshot.val());
      var details = snapshot.val();
      for (var key in details) {
        //    console.log('in for loop');
        chargeAmt = details[key].orderAmt;
        console.log('Order chargeAmt is : ' + chargeAmt);
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
            var stripeDetails = snapshot.val();
            console.log(' Card stripe customer details is : ' + JSON.stringify(stripeDetails));
            //.equalTo(firebaseCustObj.Stripe_Cus_Id)
            for (var key in stripeDetails) {
              console.log(' Key details is  : ' + JSON.stringify(stripeDetails[key]));
              if ((stripeDetails[key].Card_details.Card_Num === firebaseCustObj.Card_details.Card_Num) && (stripeDetails[key].Card_details.Card_Type === firebaseCustObj.Card_details.Card_Type)) {
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
          return stripe.charges.create({
            amount: Math.round(chargeAmt * 100), // amount in cents, again
            currency: "usd",
            customer: customer.id
          });
          //res.jsonp(customer);
        }).then(function (charge) {
          // YOUR CODE: Save the customer ID and other info in a database for later!
          console.log('charge is done')
          console.log(charge)

          charge.statusCode = 200;
          res.jsonp(charge);
        }, function (err) {
          res.jsonp(err);
          console.log('Error while creating the customer : ' + JSON.stringify(err));
        });
      }
    })
  } else {
    console.log('Card is not saved card');
    firebase.database().ref('Orders/' + restId).orderByChild("orderId").equalTo(req.body.orderId).once('value', function (snapshot) {
      console.log('Order details : ', snapshot.val());
      var details = snapshot.val();
      for (var key in details) {
        console.log('in for loop');
        chargeAmt = details[key].orderAmt;
        console.log('Order chargeAmt is : ' + chargeAmt);
        if (chargeAmt) {
          console.log('Charge amount is available : ' + chargeAmt);
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
  var restId = req.body.restId;
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

          /*firebase.database().ref('Restaurants/' + restId + '/orderEmail').once('value', function (snapshot) {
  var orderEmail = snapshot.val();

  console.log('Order details is **************');
  console.log(JSON.stringify(details));

  details.orderDetails = angular.fromJson(details.orderDetails);




})*/



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






/* Email order status to restaurant owner*/


exports.sendOrderEmail = function (req, res) {

  //console.log('Email from sendOrderEmail');
  //console.log('Email form details : ' + JSON.stringify(req.body));
  var orderInfo = req.body;

  var orderService;
  if (req.body.pickup) {
    orderService = 'PICKUP'
  } else {
    orderService = 'Table No:' + req.body.tableNum;
  }
  agenda.now('Order_Info_To_Restaurant', {
    email: orderInfo.emailId,
    orderId: orderInfo.orderId,
    orderAmt: orderInfo.orderAmt,
    customerName: orderInfo.customerName,
    orderDetails: orderInfo.orderDetails,
    orderService: orderService
  });
  res.json(req.body);
};
