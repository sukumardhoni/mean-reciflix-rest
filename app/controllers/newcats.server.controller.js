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
  AWS = require('aws-sdk'),
  fs = require('fs'),
  crypto = require('crypto'),
  _ = require('lodash');


/**
 * Create a category
 */
exports.createCat = function (req, res) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  console.log("reached the create received: " + JSON.stringify(req.body));
  var category = new Category(req.body);
  category.user = req.user;


  console.log('THe Config AWS ID : ' + config.AWS_ACCESS_KEY_ID + ' Secret Key is :  ' + config.AWS_SECRET_ACCESS_KEY);

  var file = req.files.file;
  console.log("Image Name is : " + file.name);
  console.log("Image type is : " + file.type);
  console.log("Image details: " + JSON.stringify(file));

  AWS.config = new AWS.Config();
  AWS.config.accessKeyId = config.AWS_ACCESS_KEY_ID;
  AWS.config.secretAccessKey = config.AWS_SECRET_ACCESS_KEY;
  AWS.config.region = 'us-east-1';

  // Create a bucket using bound parameters and put something in it.
  // Make sure to change the bucket name from "myBucket" to something unique.
  /*  var s3bucket = new AWS.S3({
      params: {
        Bucket: 'NewRF'
      }
    });
    s3bucket.createBucket(function () {
      var params = {
        Key: file.name,
        Body: file
      };
      s3bucket.upload(params, function (err, data) {
        if (err) {
          console.log("Error uploading data: ", err);
        } else {
          console.log("Successfully uploaded data to myBucket/myKey");
        }
      });
    });*/



  var s3 = new AWS.S3();

  var path = file.path;
  fs.readFile(path, function (err, file_buffer) {
    var params = {
      Bucket: 'NewRF',
      Key: file.name,
      Body: file_buffer
    };

    s3.putObject(params, function (perr, pres) {
      if (perr) {
        console.log("Error uploading data: ", perr);
      } else {
        console.log("Successfully uploaded data to NewRF");
      }
    });
  });



  /*  category.save(function (err) {
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
    });*/
};




exports.getSignedURL = function (req, res) {

  AWS.config = new AWS.Config();
  AWS.config.accessKeyId = config.AWS_ACCESS_KEY_ID;
  AWS.config.secretAccessKey = config.AWS_SECRET_ACCESS_KEY;
  AWS.config.region = 'us-east-1';

  var s3 = new AWS.S3();
  var s3_params = {
    Bucket: 'testrf2',
    Key: req.params.fName,
    Expires: 60,
    ContentType: req.params.fType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3_params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      var return_data = {
        signed_request: data,
        url: 'https://' + s3_params.Bucket + '.s3-us-east-1.amazonaws.com/' + req.params.fName
      };
      console.log('Callback data of SIGNEDURL : ' + JSON.stringify(return_data));
      res.send(return_data);
    }
  });



  /*
    var date = new Date();

    var s3Policy = {
      "expiration": "2050-01-01T12:00:00.000Z", // hard coded for testing
      "conditions": [
        {
          "bucket": "testrf2"
        },
        {
          "acl": "public-read"
        },
        ["starts-with", "$Content-Type", "image/*"],
        ["content-length-range", 0, 524288000]
      ]
    };

    // stringify and encode the policy
    var stringPolicy = JSON.stringify(s3Policy);
    var base64Policy = Buffer(stringPolicy, "utf-8").toString("base64");

    // sign the base64 encoded policy
    var signature = crypto.createHmac("sha1", AWS.config.secretAccessKey).update(new Buffer(base64Policy, "utf-8")).digest("base64");

    // build the results object
    var s3Credentials = {
      s3Policy: base64Policy,
      s3Signature: signature
    };

    // send it back
    //callback(s3Credentials);
    res.send(s3Credentials);*/









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

  var activeFltrFlgs = [];
  if (req.params.activeFilter == 1) {
    activeFltrFlgs.push(true);
  } else if (req.params.activeFilter == 2) {
    activeFltrFlgs.push(false);
  } else {
    activeFltrFlgs.push(true);
    activeFltrFlgs.push(false);
  }


  if (req.params.pageId == 999) {
    Category.find({
      active: {
        $in: activeFltrFlgs
      }
    }).sort('rank').populate('user', 'displayName').exec(function (err, categories) {
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
      active: {
        $in: activeFltrFlgs
      }
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
