'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('../errors.server.controller.js'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  UsageDetails = mongoose.model('UsageDetails');



exports.usersUsageDetails = function (req, res) {
  //console.log('### usersUsageDetails is called');
  var bearer = req.params.pageId.split('UC');

  UsageDetails.find().skip(bearer[0] * 5).limit(5).sort('-time.date').exec(function (err, details) {
    if (err) {
      // console.log('@@@@@@@@@ Error at categories list fetching : ' + err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log('@@@@@@@@@ Before details list  successfully fetched and req obj also : ' + JSON.stringify(req.collectionObj));
      var CollectionObj = req.collectionObj;
      CollectionObj.details = details;
      console.log('@@@@@@@@@ After details list  successfully fetched and req obj also : ' + JSON.stringify(req.collectionObj));
      res.json(CollectionObj);
    }
  });

};




exports.usersUsageCount = function (req, res, next) {
  var CollectionObj = {};
  CollectionObj.details = [];
  console.log('*************')

  console.log('PageId is   : ' + req.params.pageId);
  var bearer = req.params.pageId.split('UC');
  if (bearer[1] === '') {
    console.log('Users usage count for If part  : ' + bearer[1]);
    UsageDetails.find().exec(function (err, details) {
      if (err) {
        // console.log('@@@@@@@@@ Error at categories list fetching : ' + err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        //  console.log('@@@@@@@@@ details list  successfully fetched ');
        //CollectionObj.details = details;
        CollectionObj.count = details.length;
        req.collectionObj = CollectionObj;
        // console.log('### usersUsageDetails is total collection : ' + JSON.stringify(req.collectionObj));
        next();
      }
    });
  } else {
    console.log('Users usage count for  Else part : ' + bearer[1]);

    CollectionObj.count = bearer[1];
    req.collectionObj = CollectionObj;
    // console.log('### usersUsageDetails is total collection : ' + JSON.stringify(req.collectionObj));
    next();
  };

};
