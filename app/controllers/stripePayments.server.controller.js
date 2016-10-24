'use strict';

var config = require('../../config/config'),
  stripe = require("stripe")(config.stripe_info.affys_secret_key),
  agenda = require('../../schedules/job-schedule.js')(config.db),
  firebase = require("firebase"),
  moment = require('moment'),
  _this = this;


/*firebase.initializeApp({
  serviceAccount: config.stripe_info.firebase_serviceAccount,
  databaseURL: config.stripe_info.firebase_databaseURL
})*/

var affysFirebase = firebase.initializeApp(config.firebase_info.affyspremiumgrill, 'Affys');
var dakExpFirebase = firebase.initializeApp(config.firebase_info.affyspremiumgrill, 'DakshinExpress');



affysFirebase.database().ref('Orders/affyspremiumgrill').on('child_changed', function (snapshot) {
  var orderDetails = snapshot.val();
  if (orderDetails.paymentStatus === 'Direct Pay') {
    _this.sendOrderEmail('affyspremiumgrill', orderDetails);
  }
})

dakExpFirebase.database().ref('Orders/dakshinexpress').on('child_changed', function (snapshot) {
  var orderDetails = snapshot.val();
  if (orderDetails.paymentStatus === 'Direct Pay') {
    _this.sendOrderEmail('affyspremiumgrill', orderDetails);
  }
})




/**
 * Create a newCardPaymentCharges
 */
exports.newCardPaymentCharges = function (req, res) {
  //console.log('newCardPaymentCharges function is called');
  //console.log('Stripe Body details is : ' + JSON.stringify(req.body));
  var restId = req.body.restId;
  //var resAmt = (req.body.amount);
  var firebase;

  if (req.body.restId === 'affyspremiumgrill') {
    firebase = affysFirebase;
  } else if (req.body.restId === 'dakshinexpress') {
    firebase = dakExpFirebase;
  }

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
          _this.sendOrderEmail(restId, details[key]);
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
              _this.sendOrderEmail(restId, details[key]);
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


  var restId = req.body.restId;
  var firebase;
  if (req.body.restId === 'affyspremiumgrill') {
    firebase = affysFirebase;
  } else if (req.body.restId === 'dakshinexpress') {
    firebase = dakExpFirebase;
  }


  var chargeAmt = 0;
  firebase.database().ref('Orders/' + restId).orderByChild("orderId").equalTo(req.body.orderId).once('value', function (snapshot) {
    var details = snapshot.val();
    for (var key in details) {
      chargeAmt = details[key].orderAmt;
      if (chargeAmt) {
        console.log('Charge amount is available : ' + chargeAmt);
        stripe.charges.create({
          amount: Math.round(chargeAmt * 100), // amount in cents, again
          currency: "usd",
          customer: req.body.custId // Previously stored, then retrieved
        }).then(function (charge) {
          _this.sendOrderEmail(restId, details[key]);
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


exports.sendOrderEmail = function (restId, details) {

  console.log('Email from sendOrderEmail');


  var firebase;
  if (restId === 'affyspremiumgrill') {
    firebase = affysFirebase;
  } else if (restId === 'dakshinexpress') {
    firebase = dakExpFirebase;
  }


  firebase.database().ref('Restaurants/' + restId + '/orderEmail').once('value', function (snapshot) {
    var orderEmail = snapshot.val();



    console.log('@@@@@@@@@@@@@@@@@@@@@@@')
    console.log('@@@@***********************')
    console.log('Order emails are : ' + JSON.stringify(orderEmail));


    var emailsArray = [];
    for (var key in orderEmail) {
      emailsArray.push(orderEmail[key].email);
    }

    console.log('Order emails are : ' + JSON.stringify(emailsArray));
    var itemArrayObj = JSON.parse(details.orderDetails);
    var subTotal = 0;
    calculateSubTotal(itemArrayObj);

    function generateChoicesArray(itemArrayObj) {
      for (var a = 0; a < itemArrayObj.length; a++) {
        itemArrayObj[a].calculatedPrice = Math.round(itemArrayObj[a].calculatedPrice * 100) / 100;
        var chArray = [];
        if (itemArrayObj[a].addOnChoices) {
          for (var b = 0; b < itemArrayObj[a].addOnChoices.choiceArray.length; b++) {
            if (itemArrayObj[a].addOnChoices.choiceArray[b].checked) {
              chArray.push(itemArrayObj[a].addOnChoices.choiceArray[b].name);
            }
          }
        }
        if (itemArrayObj[a].itemAdditionalChoices) {
          for (var b in itemArrayObj[a].itemAdditionalChoices.choiceArray) {
            for (var c in itemArrayObj[a].itemAdditionalChoices.choiceArray[b].choices) {
              if (itemArrayObj[a].itemAdditionalChoices.choiceArray[b].choices[c].checked && itemArrayObj[a].itemAdditionalChoices.choiceArray[b].choices[c].name != 'None') {
                chArray.push(itemArrayObj[a].itemAdditionalChoices.choiceArray[b].choices[c].name);
              }
            }
          }
        }
        if (itemArrayObj[a].menuAdditionalChoices) {
          for (var b in itemArrayObj[a].menuAdditionalChoices.choiceArray) {
            for (var c in itemArrayObj[a].menuAdditionalChoices.choiceArray[b].choices) {
              if (itemArrayObj[a].menuAdditionalChoices.choiceArray[b].choices[c].checked && itemArrayObj[a].menuAdditionalChoices.choiceArray[b].choices[c].name != 'None') {
                chArray.push(itemArrayObj[a].menuAdditionalChoices.choiceArray[b].choices[c].name);
              }
            }
          }
        }
        itemArrayObj[a].genChArray = chArray;
      }
    }
    generateChoicesArray(itemArrayObj);
    var orderData = details;

    function calculateSubTotal(details) {
      var items = details;
      if (items) {
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          subTotal += (item.calculatedPrice * item.quantity);
        }
      }
    }
    if (subTotal != 0) {
      console.log('Subtotal is  there $$$$$$$$$$  : ' + subTotal);

      firebase.database().ref('Restaurants/' + restId + '/displayName').once('value', function (snapshot) {
        var restaurantDisplayName = snapshot.val();
        agenda.now('Order_Info_To_Restaurant', {
          formatedOrderTime: moment(orderData.orderTime).format('MMM Do YYYY, h:mm a'),
          restDisplayName: restaurantDisplayName,
          //email: 'vinodhko@globaltechminds.com',
          email: emailsArray,
          restId: restId,
          orderDetails: itemArrayObj,
          subTotalPrice: Math.round(subTotal * 100) / 100,
          orderData: orderData,
          tipAmount: Math.round(subTotal * orderData.orderTip * 100) / 100,
          foodTax: Math.round((subTotal * (orderData.restFoodTax / 100)) * 100) / 100,
          totalAmt: Math.round(orderData.orderAmt * 100) / 100
        });

      })



    } else {
      console.log('Subtotal is not there @@@');
    }
  })
};
