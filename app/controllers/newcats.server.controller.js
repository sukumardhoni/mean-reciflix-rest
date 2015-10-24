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
  _ = require('lodash');


/**
 * Create a category
 */
exports.createCat = function (req, res) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  //console.log("reached the create received: " + JSON.stringify(req.body));
  var category = new Category(req.body);
  category.user = req.user;


  AWS.config = new AWS.Config();
  AWS.config.accessKeyId = config.AWS_ACCESS_KEY_ID;
  AWS.config.secretAccessKey = config.AWS_SECRET_ACCESS_KEY;
  AWS.config.region = 'us-east-1';
  var s3 = new AWS.S3();
  var file = req.files.file;
  //console.log("Image Name is : " + file.name);
  //console.log("Image type is : " + file.type);
  //console.log("Image details: " + JSON.stringify(file));

  category.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //upload the image into AWS


      var path = file.path;
      fs.readFile(path, function (err, file_buffer) {
        var params = {
          Bucket: 'NewRF',
          //Key: req.body.imageName + file.name.substring(file.name.lastIndexOf(".")),
          Key: req.body.imageName,
          Body: file_buffer,
          ContentType: file.type,
          ACL: 'public-read'
        };
        s3.putObject(params, function (perr, pres) {
          if (perr) {
            console.log("Error uploading data: ", perr);
          } else {
            res.json(category);
           // console.log("Successfully uploaded data to NewRF");
          }
        });
      });

      //user is successfully created cat save action into user usage details collection
      agenda.now('User_Usage_Details', {
        email: emailInfo,
        device: deviceInfo,
        action: 'createCat : ' + category.displayName
      });


    }
  });
};


exports.singleCatByRank = function (req, res) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  //console.log('Successfully called the singleCatByRank fun. in server and RANK is : ' + req.params.rank);

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
   // console.log('Successfully fetched cat details is  : ' + JSON.stringify(category));

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

  AWS.config = new AWS.Config();
  AWS.config.accessKeyId = config.AWS_ACCESS_KEY_ID;
  AWS.config.secretAccessKey = config.AWS_SECRET_ACCESS_KEY;
  AWS.config.region = 'us-east-1';
  var s3 = new AWS.S3();
  var file = req.files.file;
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


      if (file) {
        //console.log("uploaded data to NewRF");
        var params = {
          Bucket: 'NewRF',
          Key: req.body.imageName + '.jpg'
        }
        s3.getObject(params, function (err, data) {
          if (err) {
            console.log(err, err.stack);
            var path = file.path;
            fs.readFile(path, function (err, file_buffer) {
              var params = {
                Bucket: 'NewRF',
                //Key: req.body.imageName + file.name.substring(file.name.lastIndexOf(".")),
                Key: req.body.imageName,
                Body: file_buffer,
                ContentType: file.type,
                ACL: 'public-read'
              };
              s3.putObject(params, function (perr, pres) {
                if (perr) {
                  console.log("Error uploading data: ", perr);
                } else {
                  res.json(category);
               //   console.log("Successfully uploaded data to NewRF");
                }
              });
            });

          } else {
          //  console.log('Image exists in AWS : ' + data); // successful response
          //  console.log('Copy source is  : ** :' + 'NewRF' + '/' + req.body.imageName + ' : **'); // successful response
            var copyParams = {
              CopySource: '/NewRF/' + req.body.imageName,
              Bucket: 'archiverf',
              Key: req.body.imageName + Date.now(),
              ContentType: file.type,
              ACL: 'public-read'
            }
            s3.copyObject(copyParams, function (err, data) {
              if (err) console.log(err, err.stack); // an error occurred
              else {
            //    console.log('Success fully copied image :' + data);
                var delParams = {
                  Bucket: 'NewRF',
                  Key: req.body.imageName
                }
                s3.deleteObject(delParams, function (err, data) {
                  if (err) console.log(err, err.stack); // an error occurred
                  else {
                    //upload the image into AWS
                    var path = file.path;
                    fs.readFile(path, function (err, file_buffer) {
                      var params = {
                        Bucket: 'NewRF',
                        //Key: req.body.imageName + file.name.substring(file.name.lastIndexOf(".")),
                        Key: req.body.imageName,
                        Body: file_buffer,
                        ContentType: file.type,
                        ACL: 'public-read'
                      };
                      s3.putObject(params, function (perr, pres) {
                        if (perr) {
                          console.log("Error uploading data: ", perr);
                        } else {
                          res.json(category);
                      //    console.log("Successfully uploaded data to NewRF");
                        }
                      });
                    });
                  }
                })
              }
            })
          }
        });
      } else {
        res.json(category);
      }
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
    console.log('Page Id is : ' + req.params.pageId);

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
