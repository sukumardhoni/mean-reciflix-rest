'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Grocery = mongoose.model('Glist'),
  _ = require('lodash');

/**
 * Create a grocery
 */
exports.glistcreate = function (req, res) {
  console.log('create grocery calling---------------');
  var grocery = new Grocery(req.body);
  grocery.user = req.user;

  grocery.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(grocery);
    }
  });
};



/**
 * List of Groceries
 */

exports.listOfGlist = function (req, res) {
  Grocery.find({
    user: req.user.id
  }).sort('-submitted.date').exec(function (err, groceries) {
      if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (groceries.length === 0) {
      return res.status(204).send({
        message: 'No data found'
      });
    } else {
       res.json(groceries);
    }
  });
};


/**
 * Show the current grocery
 */
exports.glistread = function (req, res) {
  console.log('read ----');
  res.json(req.grocery);

};

/**
 * Update a grocery
 */
exports.glistupdate = function (req, res) {
  var grocery = req.grocery;

  grocery = _.extend(grocery, req.body);

  grocery.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(grocery);
    }
  });
};


/**
 * Delete an grocery
 */
exports.glistdelete = function (req, res) {
  var grocery = req.grocery;

  grocery.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(grocery);
    }
  });
};


/**
 * Grocery middleware
 */
exports.glistByID = function (req, res, next, id) {

  console.log('read single by id');

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Grocery is invalid'
    });
  }

  Grocery.findById(id).exec(function (err, grocery) {
    if (err) return next(err);
    if (!grocery) {
      return res.status(404).send({
        message: 'Grocery not found'
      });
    }
    req.grocery = grocery;
    next();
  });
};


/**
 * Grocery authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
  if (req.grocery.user.id !== req.user.id) {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};
