'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Category = mongoose.model('NewCategory'),
  SubCats = mongoose.model('SubCats'),
  config = require('../../config/config'),
  agenda = require('../../schedules/job-schedule.js')(config.db),
  User = mongoose.model('User'),
  _ = require('lodash');


/**
 * Create a category
 */
exports.createCat = function (req, res) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  // console.log("reached the create received: " + JSON.stringify(req.body));
  var category = new Category(req.body);
  category.user = req.user;

  category.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //user is successfully created cat save action into user usage details collection
      agenda.now('User_Usage_Details', {
        email: emailInfo,
        device: deviceInfo,
        action: 'createCat : ' + category.displayName
      });
      res.json(category);
    }
  });
};

exports.singleCatByRank = function (req, res) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  console.log('Successfully called the singleCatByRank fun. in server and RANK is : ' + req.params.rank);

  Category.findOne({
    rank: req.params.rank
  }).exec(function (err, category) {
    if (!category) {
      return res.status(404).send({
        message: 'Category not found'
      });
    }
    var catResult = category.toObject();
    catResult.subCats = [];
    //next();
    console.log('Successfully fetched cat details is  : ' + JSON.stringify(category));

    SubCats.find({
      catId: category._id
    }).sort('-submitted.date').skip(req.params.pageId * 8).limit(8).exec(function (err, subcats) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (subcats.length === 0) {

        res.json(catResult);
      } else {
        //console.log('Before pushing the subcats into cats obj : ' + JSON.stringify(catResult));
        //console.log('@@@@@@@@@@@@@@@@@@@@@');
        //console.log(' subcats into cats obj : ' + JSON.stringify(subcats));
        catResult.subCats = subcats;
        //console.log('After pushed the subcats into cats obj : ' + JSON.stringify(catResult));
        //user is successfully fetched sub cats based on cat save action into user usage details collection
        agenda.now('User_Usage_Details', {
          email: emailInfo,
          device: deviceInfo,
          action: 'singleCatByRank : ' + category.displayName
        });
        res.json(catResult);
      }
    })
  })
};

/**
 * Show the current category
 */
exports.read = function (req, res) {
  //  console.log('inside categories.read');
  res.json(req.category);
};

/**
 * Update a category
 */
exports.updateCat = function (req, res) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  var category = req.category;
  category = _.extend(category, req.body);
  category.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //user is successfully updated cat save action into user usage details collection
      agenda.now('User_Usage_Details', {
        email: emailInfo,
        device: deviceInfo,
        action: 'updateCat : ' + category.displayName
      });
      res.json(category);
    }
  });
};

/**
 * Delete a category
 */
exports.deleteCat = function (req, res) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  var category = req.category;

  category.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //user is successfully deleted cat save action into user usage details collection
      agenda.now('User_Usage_Details', {
        email: emailInfo,
        device: deviceInfo,
        action: 'deleteCat : ' + category.displayName
      });
      res.json(category);
    }
  });
};

/**
 * List of Categories
 */
exports.listOfCats = function (req, res) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  //activeFilter 1= Active, 2=InActive, 3=All
  if (req.params.pageId == 999 && req.params.activeFilter == 3) {
    Category.find().sort('rank').populate('user', 'displayName').exec(function (err, categories) {
      if (err) {
        // console.log('@@@@@@@@@ Error at categories list fetching : ' + err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {

        //user is successfully Fetched cats list save action into user usage details collection
        agenda.now('User_Usage_Details', {
          email: emailInfo,
          device: deviceInfo,
          action: 'listOfCats'
        });


        //  console.log('@@@@@@@@@ categories list  successfully fetched ');
        res.json(categories);
      }
    });

  } else {

    Category.find({
      active: (req.params.activeFilter == 1)
    }).sort('rank').populate('user', 'displayName').skip(req.params.pageId * 8).limit(8).exec(function (err, categories) {
      if (err) {
        // console.log('@@@@@@@@@ Error at categories list fetching : ' + err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {

        //user is successfully Fetched cats list save action into user usage details collection
        agenda.now('User_Usage_Details', {
          email: emailInfo,
          device: deviceInfo,
          action: 'listOfCats'
        });

        //  console.log('@@@@@@@@@ categories list  successfully fetched ');
        res.json(categories);
      }
    });
  };
};



/**
 * Category middleware
 */
exports.categoryByID = function (req, res, next, id) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  /* if (!mongoose.Types.ObjectId.isValid(id)) {
     return res.status(400).send({
       message: 'Category is invalid'
     });
   }*/

  Category.findOne({
    catId: id
  }).exec(function (err, category) {
    if (err) return next(err);
    if (!category) {
      return res.status(404).send({
        message: 'Category not found'
      });
    }
    //user is successfully Single cat save action into user usage details collection
    agenda.now('User_Usage_Details', {
      email: emailInfo,
      device: deviceInfo,
      action: 'categoryByID : ' + category.displayName
    });
    req.category = category;
    next();
  });
};

/**
 * Category authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
  User.findOne({
    _id: req.user.id
  }, function (err, user) {
    if (user === null)
      return res.status(403).send({
        message: 'Not Authorized'
      });

    if (user.roles.indexOf('admin') === -1)
      return res.status(403).send({
        message: 'User does not have admin privelages'
      });
    next();
  });
};
