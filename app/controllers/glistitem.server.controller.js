'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Items = mongoose.model('Glistitem'),
  _ = require('lodash');


/**
 * Create a grocery items
 */
exports.glistcreateitems = function (req, res) {
  console.log('create glistcreateitems calling---------------');
  var items = new Items(req.body);
  items.glistid = req.params.glistIditem;

  items.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(items);
    }
  });
};


/**
 * List of Groceries items
 */

exports.listOfGlistitems = function (req, res) {

   console.log('create listOfGlistitems calling---------------');

  Items.find({
    glistid : req.params.glistIditem
  }).sort('-submitted.date').exec(function (err, items) {
      if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (items.length === 0) {
      return res.status(204).send({
        message: 'No data found'
      });
    } else {
       res.json(items);
    }
  });
};



/**
 * Show the current grocery item
 */
exports.listOfGlistitemssingle = function (req, res) {
  console.log('read ----');
  res.json(req.items);

};



/**
 * Update a grocery item
 */
exports.glistupdateitemssingle = function (req, res) {
  var items = req.items;

  items = _.extend(items, req.body);

  items.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(items);
    }
  });
};



/**
 * Delete an grocery item
 */
exports.glistitemdeletesingle = function (req, res) {
  var items = req.items;

  items.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(items);
    }
  });
};




/**
 * Grocery middleware
 */
exports.glistitemByID = function (req, res, next, id) {

  console.log('read single item by id');

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Grocery is invalid'
    });
  }

  Items.findById(id).exec(function (err, items) {
    if (err) return next(err);
    if (!items) {
      return res.status(404).send({
        message: 'items not found'
      });
    }
    req.items = items;
    next();
  });
};



