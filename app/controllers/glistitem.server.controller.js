'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Items = mongoose.model('GListItem'),
  _ = require('lodash');


/**
 * Create a grocery items
 */
exports.gListItemCreate = function (req, res) {
  console.log('create glistcreateitems calling---------------');
  var item = new Items(req.body);
  item.gListId = req.params.gListId;

  item.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(item);
    }
  });
};


/**
 * List of Groceries items
 */

exports.listOfGlistItems = function (req, res) {

  console.log('create listOfGlistitems calling---------------');

  Items.find({
    gListId: req.params.gListId
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
exports.getSingleGListItem = function (req, res) {
  console.log('read ----');
  res.json(req.item);

};



/**
 * Update a grocery item
 */
exports.updateSingleGListItem = function (req, res) {
  var item = req.item;

  item = _.extend(item, req.body);

  item.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(item);
    }
  });
};



/**
 * Delete an grocery item
 */
exports.deleteSingleGListItem = function (req, res) {
  var item = req.item;

  item.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(item);
    }
  });
};




/**
 * Grocery middleware
 */
exports.gListItemByID = function (req, res, next, id) {
  console.log('read single item by id');
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Grocery is invalid'
    });
  }
  Items.findById(id).exec(function (err, item) {
    if (err) return next(err);
    if (!item) {
      return res.status(404).send({
        message: 'items not found'
      });
    }
    req.item = item;
    next();
  });
};
