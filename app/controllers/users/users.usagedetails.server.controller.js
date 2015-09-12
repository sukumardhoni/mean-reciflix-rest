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
  console.log('### usersUsageDetails is called');

  UsageDetails.find().skip(req.params.pageId * 5).limit(5).sort('-time.date').exec(function (err, details) {
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
      console.log('### usersUsageDetails is total collection : ' + JSON.stringify(req.collectionObj));
      next();
    }
  });






};
