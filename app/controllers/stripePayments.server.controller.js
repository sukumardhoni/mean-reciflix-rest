'use strict';

var config = require('../../config/config'),
	stripe = require("stripe")(config.stripe_info.affys_secret_key),
	stripe_qa = require("stripe")(config.stripe_info.affys_secret_key_qa),
	agenda = require('../../schedules/job-schedule.js')(config.db),
	firebase = require("firebase"),
	moment = require('moment'),
	moment_tz = require('moment-timezone'),
	FCM = require('fcm-push'),
	_this = this;


/*firebase.initializeApp({
  serviceAccount: config.stripe_info.firebase_serviceAccount,
  databaseURL: config.stripe_info.firebase_databaseURL
})*/

var affysFirebase = firebase.initializeApp(config.firebase_info.affyspremiumgrill, 'Affys');
var dakExpFirebase = firebase.initializeApp(config.firebase_info.dakshinexpress, 'DakshinExpress');


var affysFirebase_qa = firebase.initializeApp(config.firebase_info.affyspremiumgrill_qa, 'Affys QA');
var dakExpFirebase_qa = firebase.initializeApp(config.firebase_info.dakshinexpress_qa, 'DakshinExpress QA');



var hairMovementFirebase = (firebase.initializeApp(config.firebase_info.hairmovement)).database().ref('salon/promo/w2017/');

var newItems = false;


hairMovementFirebase.once('value', function (messages) {
	newItems = true;
});



hairMovementFirebase.on('child_added', function (snap) {
	if (!newItems) {
		return;
	} else {
		var userDetails = snap.val();
		_this.sendUserDetails(userDetails);
	}

})
hairMovementFirebase.on('child_changed', function (snap) {
	if (!newItems) {
		return;
	} else {
		var userDetails = snap.val();
		_this.sendUserDetails(userDetails);
	}
})

exports.sendUserDetails = function (userData) {
	console.log('*******************hairmovent firebase is called ' + JSON.stringify(userData));
	agenda.now('New_User_Added', userData);
}




affysFirebase.database().ref('Restaurants/affyspremiumgrill/Orders').on('child_changed', function (snapshot) {
	var orderDetails = snapshot.val();
	if (orderDetails.paymentStatus === 'Direct Pay') {
		_this.sendOrderEmail('affyspremiumgrill', orderDetails);
	}
})


affysFirebase_qa.database().ref('Restaurants/affyspremiumgrill/Orders').on('child_changed', function (snapshot) {
	var orderDetails = snapshot.val();
	if (orderDetails.paymentStatus === 'Direct Pay') {
		_this.sendOrderEmailQA('affyspremiumgrill', orderDetails);
	}
})

dakExpFirebase.database().ref('Restaurants/dakshinexpress/Orders').on('child_changed', function (snapshot) {
	var orderDetails = snapshot.val();
	if (orderDetails.paymentStatus === 'Direct Pay') {
		_this.sendOrderEmail('dakshinexpress', orderDetails);
	}
})

dakExpFirebase_qa.database().ref('Restaurants/dakshinexpress/Orders').on('child_changed', function (snapshot) {
	var orderDetails = snapshot.val();
	if (orderDetails.paymentStatus === 'Direct Pay') {
		_this.sendOrderEmailQA('dakshinexpress', orderDetails);
	}
})




/**
 * Create a newCardPaymentCharges
 */
exports.newCardPaymentChargesQA = function (req, res) {
	console.log('newCardPaymentChargesQA function is called');
	console.log('Stripe Body details is : ' + JSON.stringify(req.body));
	var restId = req.body.restId;
	//var resAmt = (req.body.amount);
	var firebase;

	if (req.body.restId === 'affyspremiumgrill') {
		firebase = affysFirebase_qa;
	} else if (req.body.restId === 'dakshinexpress') {

		console.log('Its Dakshin restaurant : ' + restId);
		firebase = dakExpFirebase_qa;
	}


	console.log('Total body details are  : ' + JSON.stringify(req.body));

	var chargeAmt = 0;
	var stripeToken = req.body.sToken;

	if (req.body.saveCard) {
		firebase.database().ref('Restaurants/' + restId + '/Orders').child(req.body.orderId).once('value', function (snapshot) {
			console.log('Order details : ', snapshot.val());
			var details = snapshot.val();
			//for (var key in details) {
			//    console.log('in for loop');
			chargeAmt = details.orderAmt;
			console.log('Order chargeAmt is : ' + chargeAmt);
			stripe_qa.customers.create({
				source: req.body.sToken,
				description: 'Customers for :' + restId,
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

				var cardKey = firebaseCustObj.Card_details.Card_Type + firebaseCustObj.Card_details.Card_Num;

				firebase.database().ref('Restaurants/' + restId + '/Users/' + firebaseCustObj.uuid + '/savedCards').child(cardKey).once('value', function (snapshot) {
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
						firebase.database().ref('Restaurants/' + restId + '/Users/' + firebaseCustObj.uuid + '/savedCards/' + cardKey).set(firebaseCustObj);
					} else {
						console.log('Saving new card to same user  ');
						//firebase.database().ref('StripeCustomers/' + restId + '/' + firebaseCustObj.uuid).push(firebaseCustObj);

						firebase.database().ref('Restaurants/' + restId + '/Users/' + firebaseCustObj.uuid + '/savedCards/' + cardKey).set(firebaseCustObj);
					}
				});
				return stripe_qa.charges.create({
					amount: Math.round(chargeAmt * 100), // amount in cents, again
					currency: "usd",
					customer: customer.id
				});
				//res.jsonp(customer);
			}).then(function (charge) {
				// YOUR CODE: Save the customer ID and other info in a database for later!
				console.log('charge is done')
				console.log(charge)
				_this.sendOrderEmailQA(restId, details);
				charge.statusCode = 200;
				res.jsonp(charge);
			}, function (err) {
				res.jsonp(err);
				console.log('Error while creating the customer : ' + JSON.stringify(err));
			});
			//}
		})
	} else {
		console.log('Card is not saved card');
		firebase.database().ref('Restaurants/' + restId + '/Orders').child(req.body.orderId).once('value', function (snapshot) {
			console.log('Order details : ', snapshot.val());
			var details = snapshot.val();
			//for (var key in details) {
			console.log('in for loop');
			chargeAmt = details.orderAmt;
			console.log('Order chargeAmt is : ' + chargeAmt);
			if (chargeAmt) {
				console.log('Charge amount is available : ' + chargeAmt);
				var charge = stripe_qa.charges.create({
					amount: Math.round(chargeAmt * 100), // amount in cents, again
					currency: "usd",
					source: stripeToken,
					description: 'Customers for Affys'
				}, function (err, charge) {
					if (err && err.type === 'StripeCardError') {
						console.log('err charging amount : ' + JSON.stringify(err));
						res.jsonp(err);
					} else {
						_this.sendOrderEmailQA(restId, details);
						charge.statusCode = 200;
						res.jsonp(charge);
					}
				});
			}
			//}
		})
	}
};
exports.newCardPaymentCharges = function (req, res) {
	//console.log('newCardPaymentCharges function is called');
	//console.log('Stripe Body details is : ' + JSON.stringify(req.body));
	var restId = req.body.restId;
	//var resAmt = (req.body.amount);
	var firebase;

	if (req.body.restId === 'affyspremiumgrill') {
		firebase = affysFirebase;
	} else if (req.body.restId === 'dakshinexpress') {

		console.log('Its Dakshin restaurant : ' + restId);
		firebase = dakExpFirebase;
	}


	console.log('Total body details are  : ' + JSON.stringify(req.body));

	var chargeAmt = 0;
	var stripeToken = req.body.sToken;

	if (req.body.saveCard) {
		firebase.database().ref('Restaurants/' + restId + '/Orders').child(req.body.orderId).once('value', function (snapshot) {
			console.log('Order details : ', snapshot.val());
			var details = snapshot.val();
			//for (var key in details) {
			//    console.log('in for loop');
			chargeAmt = details.orderAmt;
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

				var cardKey = firebaseCustObj.Card_details.Card_Type + firebaseCustObj.Card_details.Card_Num;

				firebase.database().ref('Restaurants/' + restId + '/Users/' + firebaseCustObj.uuid + '/savedCards').child(cardKey).once('value', function (snapshot) {
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
						firebase.database().ref('Restaurants/' + restId + '/Users/' + firebaseCustObj.uuid + '/savedCards/' + cardKey).set(firebaseCustObj);
					} else {
						console.log('Saving new card to same user  ');
						//firebase.database().ref('StripeCustomers/' + restId + '/' + firebaseCustObj.uuid).push(firebaseCustObj);

						firebase.database().ref('Restaurants/' + restId + '/Users/' + firebaseCustObj.uuid + '/savedCards/' + cardKey).set(firebaseCustObj);
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
				_this.sendOrderEmail(restId, details);
				charge.statusCode = 200;
				res.jsonp(charge);
			}, function (err) {
				res.jsonp(err);
				console.log('Error while creating the customer : ' + JSON.stringify(err));
			});
			//}
		})
	} else {
		console.log('Card is not saved card');
		firebase.database().ref('Restaurants/' + restId + '/Orders').child(req.body.orderId).once('value', function (snapshot) {
			console.log('Order details : ', snapshot.val());
			var details = snapshot.val();
			//for (var key in details) {
			console.log('in for loop');
			chargeAmt = details.orderAmt;
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
						_this.sendOrderEmail(restId, details);
						charge.statusCode = 200;
						res.jsonp(charge);
					}
				});
			}
			//}
		})
	}
};




/**
 * Create a savedCardPaymentCharges
 */
exports.savedCardPaymentChargesQA = function (req, res) {
	//console.log('savedCardPaymentCharges function is called');


	var restId = req.body.restId;
	var firebase;
	if (req.body.restId === 'affyspremiumgrill') {
		firebase = affysFirebase_qa;
	} else if (req.body.restId === 'dakshinexpress') {
		firebase = dakExpFirebase_qa;
	}


	var chargeAmt = 0;
	firebase.database().ref('Restaurants/' + restId + '/Orders').child(req.body.orderId).once('value', function (snapshot) {
		var details = snapshot.val();
		//for (var key in details) {
		chargeAmt = details.orderAmt;
		if (chargeAmt) {
			console.log('Charge amount is available : ' + chargeAmt);
			stripe_qa.charges.create({
				amount: Math.round(chargeAmt * 100), // amount in cents, again
				currency: "usd",
				customer: req.body.custId // Previously stored, then retrieved
			}).then(function (charge) {
				_this.sendOrderEmailQA(restId, details);
				// YOUR CODE: Save the customer ID and other info in a database for later!
				charge.statusCode = 200;
				res.jsonp(charge);
			}, function (err) {
				console.log('Error while charging from saved card customer : ' + JSON.stringify(err));
				res.jsonp(err);
			});
		}
		//}
	})
};

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
	firebase.database().ref('Restaurants/' + restId + '/Orders').child(req.body.orderId).once('value', function (snapshot) {
		var details = snapshot.val();
		//for (var key in details) {
		chargeAmt = details.orderAmt;
		if (chargeAmt) {
			console.log('Charge amount is available : ' + chargeAmt);
			stripe.charges.create({
				amount: Math.round(chargeAmt * 100), // amount in cents, again
				currency: "usd",
				customer: req.body.custId // Previously stored, then retrieved
			}).then(function (charge) {
				_this.sendOrderEmail(restId, details);
				// YOUR CODE: Save the customer ID and other info in a database for later!
				charge.statusCode = 200;
				res.jsonp(charge);
			}, function (err) {
				console.log('Error while charging from saved card customer : ' + JSON.stringify(err));
				res.jsonp(err);
			});
		}
		//}
	})
};






/* Email order status to restaurant owner*/


exports.sendOrderEmailQA = function (restId, details) {

	console.log('Email from sendOrderEmailQA');


	var firebase;
	if (restId === 'affyspremiumgrill') {
		firebase = affysFirebase_qa;
	} else if (restId === 'dakshinexpress') {
		firebase = dakExpFirebase_qa;
	}


	firebase.database().ref('Restaurants/' + restId + '/info/orderEmail').once('value', function (snapshot) {
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
				itemArrayObj[a].calculatedPrice = parseFloat(Math.round(itemArrayObj[a].calculatedPrice * 100) / 100).toFixed(2);

				itemArrayObj[a].itemTotalPrice = parseFloat(itemArrayObj[a].calculatedPrice * (itemArrayObj[a].quantity - itemArrayObj[a].voidQty)).toFixed(2);



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

		function calculateSubTotal(itemDetails) {
			var items = itemDetails;
			if (items) {
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					subTotal += (item.calculatedPrice * (item.quantity - item.voidQty));
				}
			}
		}
		if (subTotal != 0) {
			console.log('Subtotal is  there $$$$$$$$$$ QAAAA  : ' + subTotal);

			firebase.database().ref('Restaurants/' + restId + '/info/displayName').once('value', function (snapshot) {
				var restaurantDisplayName = snapshot.val();

				var tipAmount;


				console.log(' ORDER DATA IS : ' + JSON.stringify(orderData));



				if (orderData.orderTip == 'customTip') {
					tipAmount = parseFloat(orderData.tipAmt);




				} else {
					tipAmount = parseFloat(Math.round(subTotal * orderData.orderTip) / 100).toFixed(2);



				}


				if (orderData.discountPercentage) {

					console.log('orderData.discountAmount : ' + orderData.discountAmount);

					console.log('Discount  tipAmount  $$$$$$$$$$  : ');
					console.log('Discount   $$$$$$$$$$  : ');
					console.log('Discount  tipAmount  $$$$$$$$$$  : ');



					agenda.now('Order_Info_To_Restaurant_QA', {
						formatedOrderTime: moment(orderData.orderTime).format('MMM Do YYYY, h:mm a'),
						restDisplayName: restaurantDisplayName,
						//email: 'vinodhko@globaltechminds.com',
						email: emailsArray,
						discountAmount: parseFloat(orderData.discountAmount).toFixed(2),
						discountPercentage: orderData.discountPercentage,
						restId: restId,
						orderDetails: itemArrayObj,
						subTotalPrice: parseFloat(Math.round(subTotal * 100) / 100).toFixed(2),
						orderData: orderData,
						tipAmount: tipAmount,
						foodTax: parseFloat(Math.round((subTotal * (orderData.restFoodTax / 100)) * 100) / 100).toFixed(2),
						totalAmt: parseFloat(Math.round(orderData.orderAmt * 100) / 100).toFixed(2)
					});




				} else {


					console.log('Without Discount tipAmount  $$$$$$$$$$  : ');
					console.log('Without Discount tipAmount  $$$$$$$$$$  : ');
					console.log('Without Discount tipAmount  $$$$$$$$$$  : ');
					console.log('Without Discount tipAmount  $$$$$$$$$$  : ');

					agenda.now('Order_Info_To_Restaurant_QA', {
						formatedOrderTime: moment(orderData.orderTime).format('MMM Do YYYY, h:mm a'),
						restDisplayName: restaurantDisplayName,
						//email: 'vinodhko@globaltechminds.com',
						email: emailsArray,
						restId: restId,
						orderDetails: itemArrayObj,
						subTotalPrice: parseFloat(Math.round(subTotal * 100) / 100).toFixed(2),
						orderData: orderData,
						tipAmount: tipAmount,
						foodTax: parseFloat(Math.round((subTotal * (orderData.restFoodTax / 100)) * 100) / 100).toFixed(2),
						totalAmt: parseFloat(Math.round(orderData.orderAmt * 100) / 100).toFixed(2)
					});
				}



			})



		} else {
			console.log('Subtotal is not there @@@');
		}
	})
};
exports.sendOrderEmail = function (restId, details) {

	console.log('Email from sendOrderEmail');


	var firebase;
	if (restId === 'affyspremiumgrill') {
		firebase = affysFirebase;
	} else if (restId === 'dakshinexpress') {
		firebase = dakExpFirebase;
	}


	firebase.database().ref('Restaurants/' + restId + '/info/orderEmail').once('value', function (snapshot) {
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
				itemArrayObj[a].calculatedPrice = parseFloat(Math.round(itemArrayObj[a].calculatedPrice * 100) / 100).toFixed(2);

				itemArrayObj[a].itemTotalPrice = parseFloat(itemArrayObj[a].calculatedPrice * itemArrayObj[a].quantity).toFixed(2);



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

		function calculateSubTotal(itemDetails) {
			var items = itemDetails;
			if (items) {
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					subTotal += (item.calculatedPrice * item.quantity);
				}
			}
		}
		if (subTotal != 0) {
			console.log('Subtotal is  there $$$$$$$$$$ QAAAA  : ' + subTotal);

			firebase.database().ref('Restaurants/' + restId + '/info/displayName').once('value', function (snapshot) {
				var restaurantDisplayName = snapshot.val();

				var tipAmount;


				console.log(' ORDER DATA IS : ' + JSON.stringify(orderData));



				if (orderData.orderTip == 'customTip') {
					tipAmount = parseFloat(orderData.tipAmt);

					console.log('tipAmount  $$$$$$$$$$  : ' + tipAmount);
					console.log('tipAmount  $$$$$$$$$$  : ' + tipAmount);
					console.log('tipAmount  $$$$$$$$$$  : ' + tipAmount);
					console.log('tipAmount  $$$$$$$$$$  : ' + tipAmount);


				} else {
					tipAmount = parseFloat(Math.round(subTotal * orderData.orderTip) / 100).toFixed(2);
					console.log('ELSE ELSE ELSE tipAmount  $$$$$$$$$$  : ' + tipAmount);
					console.log('ELSE ELSE ELSE tipAmount  $$$$$$$$$$  : ' + tipAmount);
					console.log('ELSE ELSE ELSE tipAmount  $$$$$$$$$$  : ' + tipAmount);


				}


				agenda.now('Order_Info_To_Restaurant_QA', {
					formatedOrderTime: moment(orderData.orderTime).format('MMM Do YYYY, h:mm a'),
					restDisplayName: restaurantDisplayName,
					//email: 'vinodhko@globaltechminds.com',
					email: emailsArray,
					restId: restId,
					orderDetails: itemArrayObj,
					subTotalPrice: parseFloat(Math.round(subTotal * 100) / 100).toFixed(2),
					orderData: orderData,
					tipAmount: tipAmount,
					foodTax: parseFloat(Math.round((subTotal * (orderData.restFoodTax / 100)) * 100) / 100).toFixed(2),
					totalAmt: parseFloat(Math.round(orderData.orderAmt * 100) / 100).toFixed(2)
				});

			})



		} else {
			console.log('Subtotal is not there @@@');
		}
	})
};








/*Push Notification MSGS*/


exports.fcmNotificationsQA = function (req, res) {


	console.log('fcmNotifications is called QA');
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')

	console.log('Body details : ' + JSON.stringify(req.body));


	var serverKey = 'AAAAE8474Ys:APA91bFxcHsEKLs8OmDbcoogR62qO5xGf4xhjG1_X5MB1swLMxxAgO6lVKV8SVkjAWiFm67iV3gonaXh1PayrxM8Lzl-TGf6KlvcgpR1ljDeuHc9lDS3bgBcKNFmSpUp9B8NGM7Jr--686kj-HTu33xIt0yVXWZHnQ';
	var fcm = new FCM(serverKey);

	var message = {
		//to: 'dsC6cgUNKq0:APA91bGzD0C1yQZdBigs-3BD3zLXDX5FwQer1T9cl-Bs311cIw6CVXd4F-FJsuMMLerR79PbK5cXm0-PzduU6pBgq9pzP_G41ZJLhfvZX1d6A5qHTYV0qg9ic4JJJj3dhc2JHHwy-aqn', // required fill with device token or topics
		to: req.body.token,
		collapse_key: 'TEST_DEMO',
		data: {
			your_custom_data_key: 'your_custom_data_value'
		},
		notification: {
			title: 'Affys Premium Grill',
			body: req.body.msg,
			"sound": "default",
			"icon": "myicon"
		}
	};

	//callback style
	/* fcm.send(message, function (err, response) {
	  if (err) {
	    console.log("Something has gone wrong!");
	  } else {
	    console.log("Successfully sent with response: ", response);
	  }
	});*/

	//promise style
	fcm.send(message)
		.then(function (response) {
			console.log("Successfully sent with response: ", response);
		})
		.catch(function (err) {
			console.log("Something has gone wrong!");
			console.error("Error callback on fcm : " + JSON.stringify(err));
		})

}



exports.fcmNotifications = function (req, res) {


	console.log('fcmNotifications is called');
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')


	var serverKey = 'AAAAE8474Ys:APA91bFxcHsEKLs8OmDbcoogR62qO5xGf4xhjG1_X5MB1swLMxxAgO6lVKV8SVkjAWiFm67iV3gonaXh1PayrxM8Lzl-TGf6KlvcgpR1ljDeuHc9lDS3bgBcKNFmSpUp9B8NGM7Jr--686kj-HTu33xIt0yVXWZHnQ';
	var fcm = new FCM(serverKey);

	var message = {
		//to: 'dsC6cgUNKq0:APA91bGzD0C1yQZdBigs-3BD3zLXDX5FwQer1T9cl-Bs311cIw6CVXd4F-FJsuMMLerR79PbK5cXm0-PzduU6pBgq9pzP_G41ZJLhfvZX1d6A5qHTYV0qg9ic4JJJj3dhc2JHHwy-aqn', // required fill with device token or topics
		to: req.body.token,
		collapse_key: 'TEST_DEMO',
		data: {
			your_custom_data_key: 'your_custom_data_value'
		},
		notification: {
			title: 'Affys Premium Grill',
			body: req.body.msg,
			"sound": "default",
			"icon": "myicon"
		}
	};

	//callback style
	/* fcm.send(message, function (err, response) {
	  if (err) {
	    console.log("Something has gone wrong!");
	  } else {
	    console.log("Successfully sent with response: ", response);
	  }
	});*/

	//promise style
	fcm.send(message)
		.then(function (response) {
			console.log("Successfully sent with response: ", response);
		})
		.catch(function (err) {
			console.log("Something has gone wrong!");
			console.error("Error callback on fcm : " + JSON.stringify(err));
		})

}



exports.printerStatus = function (env, printerObj) {
	console.log('printerStatus is called : ' + JSON.stringify(printerObj));

	console.log('Env is : ' + env);

	var firebase;
	if (env === 'prod') {
		firebase = affysFirebase;
	} else if (env === 'qa') {
		firebase = affysFirebase_qa;
	}

	var restId = 'affyspremiumgrill';
	var logKey = printerObj.time.replace(/[^A-Z0-9]+/ig, "_");

	firebase.database().ref('Restaurants/' + restId + '/PrinterStats/' + printerObj.printerId + '/' + logKey).set(printerObj);
	return 'successfully saved printer status';
}





exports.printerStatusProd = function (req, res) {

	var printerObj = {
		printerId: req.params.printerId,
		time: moment(Date.now()).tz("America/New_York").format('l, h:mm:ss a'),
		live: parseInt(req.params.statusCode)
	}
	res.jsonp(_this.printerStatus('prod', printerObj));
}
exports.printerStatusQA = function (req, res) {
	var printerObj = {
		printerId: req.params.printerId,
		time: moment(Date.now()).tz("America/New_York").format('l, h:mm:ss a'),
		live: parseInt(req.params.statusCode)
	}
	res.jsonp(_this.printerStatus('qa', printerObj));
}
