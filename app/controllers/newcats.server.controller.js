'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Category = mongoose.model('NewCategory'),
  SubCats = mongoose.model('SubCats'),
  User = mongoose.model('User'),
  _ = require('lodash');


/**
 * Create a category
 */
exports.create = function (req, res) {
  // console.log("reached the create received: " + JSON.stringify(req.body));
  var category = new Category(req.body);
  category.user = req.user;

  category.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(category);
    }
  });
};


/**
 * Create a new category
 */
exports.createnewcategory = function (req, res) {
  console.log('Create a new category: ' + JSON.stringify(req.body));
  var category = new Category(req.body);
  category.user = req.user;

  category.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(category);
    }
  });
};



exports.singleCatByRank = function (req, res) {
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
        console.log('Before pushing the subcats into cats obj : ' + JSON.stringify(catResult));
        console.log('@@@@@@@@@@@@@@@@@@@@@');
        console.log(' subcats into cats obj : ' + JSON.stringify(subcats));
        catResult.subCats = subcats;
        console.log('After pushed the subcats into cats obj : ' + JSON.stringify(catResult));
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
exports.update = function (req, res) {
  var category = req.category;
  category = _.extend(category, req.body);
  category.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(category);
    }
  });
};

/**
 * Delete a category
 */
exports.delete = function (req, res) {
  var category = req.category;

  category.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(category);
    }
  });
};

/**
 * List of Categories
 */
exports.list = function (req, res) {
  //activeFilter 1= Active, 2=InActive, 3=All
  if (req.params.pageId == 999 && req.params.activeFilter == 3) {
    Category.find().sort('rank').populate('user', 'displayName').exec(function (err, categories) {
      if (err) {
        // console.log('@@@@@@@@@ Error at categories list fetching : ' + err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
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
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Category is invalid'
    });
  }

  Category.findById(id).exec(function (err, category) {
    if (err) return next(err);
    if (!category) {
      return res.status(404).send({
        message: 'Category not found'
      });
    }
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
