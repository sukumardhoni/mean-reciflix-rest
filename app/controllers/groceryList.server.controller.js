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
  console.log('read ----');
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

exports.listOfGroceries = function (req, res) {
  Grocery.find({
    user: req.user.id
  }).sort('-submitted.date').exec(function (err, groceries) {
    var gLists = [];
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (groceries.length === 0) {
      return res.status(204).send({
        message: 'No data found'
      });
    } else {
      for (var i = 0; i < groceries.length; i++) {
        gLists.push({
          _id: groceries[i]._id,
          name: groceries[i].name,
           active: groceries[i].active
        });
        if (gLists.length === groceries.length) {
          res.jsonp(gLists);
        }
      }
    }
  });
};




/**
 * List of readactive
 */
exports.readactive = function (req, res) {

	Grocery.find({
         user: req.user.id,
        active: req.params.active,
        completed: req.params.completed

    }).sort('-submitted.date').exec(function (err, grocery) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(grocery);
        }
    });
};








/**
 * Grocery middleware
 */
exports.groceryByID = function (req, res, next, id) {

  console.log('read single by id');

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Grocery is invalid'
    });
  }

  Grocery.findById(id).populate('user', 'displayName').exec(function (err, grocery) {
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
