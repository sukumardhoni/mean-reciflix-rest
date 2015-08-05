'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Category = mongoose.model('NewCategory'),
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

   console.log('@@@@@@@@@ categories list  successfully fetched 111111111111111111111');
  if(req.params.pageId == 999){
    console.log('@@@@@@@@@ categories list  successfully fetched 22222222222');
  Category.find().sort('-created').populate('user', 'displayName').exec(function (err, categories) {
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

  }else{

  Category.find().sort('-created').populate('user', 'displayName').skip(req.params.pageId * 4).limit(4).exec(function (err, categories) {
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
