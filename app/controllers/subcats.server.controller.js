'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  config = require('../../config/config'),
  agenda = require('../../schedules/job-schedule.js')(config.db),
  SubCats = mongoose.model('SubCats'),
  Vrecipe = mongoose.model('Vrecipe'),
  _ = require('lodash');


/**
 * Create a SubCats
 */
exports.subCatCreate = function (req, res) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  console.log('create subCatsCreate calling--------------- : ' + JSON.stringify(req.body));
  var subcat = new SubCats(req.body);
  subcat.catId = req.params.newCatId;

  subcat.save(function (err) {
    if (err) {
      console.log('ERROR while saving subcat details : ' + err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //user is successfully created sub cat save action into user usage details collection
      agenda.now('User_Usage_Details', {
        email: emailInfo,
        device: deviceInfo,
        action: 'subCatCreate : ' + subcat.displayName
      });
      res.json(subcat);
    }
  });
};


/**
 * List of Subcats
 */

exports.listOfSubCats = function (req, res) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  console.log('listOfSubCats calling---------------');
  console.log('listOfSubCats called and CAt model is : --------------- ' + JSON.stringify(req.category));
  var catResult = req.category.toObject();
  catResult.recipeCount = 462;
  catResult.subCats = [];
  //catResult.recipes = [];

  if (req.params.pageId == 999) {
    SubCats.find({
      catId: req.params.newCatId
    }).sort('-submitted.date').exec(function (err, subcats) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (subcats.length === 0) {
          res.json(catResult);
      } else {
        catResult.subCats = subcats;
        //user is successfully fetched list of sub cats save action into user usage details collection
        agenda.now('User_Usage_Details', {
          email: emailInfo,
          device: deviceInfo,
          action: 'listOfSubCats : ' + catResult.displayName
        });
        res.json(catResult);
      }
    })

  } else {
    console.log('listOfSubCats calling-------PageId-------- : ' + req.params.pageId);

    SubCats.find({
      catId: req.params.newCatId
    }).sort('-submitted.date').skip(req.params.pageId * 8).limit(8).exec(function (err, subcats) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (subcats.length === 0) {
        res.json(catResult);
      } else {
        catResult.subCats = subcats;
        //user is successfully fetched list of sub cats save action into user usage details collection
        agenda.now('User_Usage_Details', {
          email: emailInfo,
          device: deviceInfo,
          action: 'listOfSubCats : ' + catResult.displayName
        });
        res.json(catResult);
      }
    })
  };
};


/**
 * Show the current subcats
 */
exports.getSubCat = function (req, res) {
  console.log('read ----');
  res.json(req.subcat);

};



/**
 * Update a SubCat
 */
exports.updateSubCat = function (req, res) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  var subcat = req.subcat;

  subcat = _.extend(subcat, req.body);

  subcat.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //user is successfully updated sub cat save action into user usage details collection
      agenda.now('User_Usage_Details', {
        email: emailInfo,
        device: deviceInfo,
        action: 'updateSubCat : ' + subcat.displayName
      });
      res.json(subcat);
    }
  });
};



/**
 * Delete an SubCat
 */
exports.deleteSubCat = function (req, res) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  var subcat = req.subcat;

  subcat.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //user is successfully deleted sub cat save action into user usage details collection
      agenda.now('User_Usage_Details', {
        email: emailInfo,
        device: deviceInfo,
        action: 'deleteSubCat : ' + subcat.displayName
      });
      res.json(subcat);
    }
  });
};




/**
 * SubCats middleware
 */
exports.subCatByID = function (req, res, next, id) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
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
    //user is successfully fetched single sub cat save action into user usage details collection
    agenda.now('User_Usage_Details', {
      email: emailInfo,
      device: deviceInfo,
      action: 'subCatByID : ' + subcat.displayName
    });
    req.subcat = subcat;
    next();
  });
};
