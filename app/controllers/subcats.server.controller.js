'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  SubCats = mongoose.model('SubCats'),
  _ = require('lodash');


/**
 * Create a SubCats
 */
exports.subCatsCreate = function (req, res) {
  console.log('create subCatsCreate calling---------------');
  var subcat = new SubCats(req.body);
  subcat.catId = req.params.catId;

  subcat.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subcat);
    }
  });
};


/**
 * List of Subcats
 */

exports.listOfSubCats = function (req, res) {

  console.log('create listOfSubCats calling---------------');

  SubCats.find({
    catId: req.params.catId
  }).sort('-submitted.date').exec(function (err, subcats) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (subcats.length === 0) {
      return res.status(204).send({
        message: 'No data found'
      });
    } else {
      res.json(subcats);
    }
  });
};

/**
 * Show the current subcats
 */
exports.getSingleSubCat = function (req, res) {
  console.log('read ----');
  res.json(req.subcat);

};



/**
 * Update a SubCat
 */
exports.updateSingleSubCat = function (req, res) {
  var subcat = req.subcat;

  subcat = _.extend(subcat, req.body);

  subcat.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subcat);
    }
  });
};



/**
 * Delete an SubCat
 */
exports.deleteSingleSubCat = function (req, res) {
  var subcat = req.subcat;

  subcat.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subcat);
    }
  });
};




/**
 * SubCats middleware
 */
exports.subCatByID = function (req, res, next, id) {
  console.log('read single SubCat by id');
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'SubCat is invalid'
    });
  }
  SubCats.findById(id).exec(function (err, subcat) {
    if (err) return next(err);
    if (!subcat) {
      return res.status(404).send({
        message: 'SubCats not found'
      });
    }
    req.subcat = subcat;
    next();
  });
};
