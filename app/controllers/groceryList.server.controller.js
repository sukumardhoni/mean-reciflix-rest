'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Grocery = mongoose.model('Grocery'),
  _ = require('lodash');

/**
 * Create a grocery
 */
exports.create = function (req, res) {
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
 * Show the current grocery
 */
exports.read = function (req, res) {
  res.json(req.grocery);
};

/**
 * Update a grocery
 */
exports.update = function (req, res) {
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
exports.delete = function (req, res) {
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
 * List of Groceries
 */
exports.list = function (req, res) {
  Grocery.find().sort('-created').populate('user', 'displayName').exec(function (err, groceries) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(groceries);
    }
  });
};

/**
 * Grocery middleware
 */
exports.groceryByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }

  Grocery.findById(id).populate('user', 'displayName').exec(function (err, grocery) {
    if (err) return next(err);
    if (!grocery) {
      return res.status(404).send({
        message: 'Article not found'
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
