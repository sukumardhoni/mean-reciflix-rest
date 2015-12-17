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
  AWS = require('aws-sdk'),
  fs = require('fs'),
  _ = require('lodash');


/**
 * Create a SubCats
 */
exports.subCatCreate = function (req, res) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  // console.log('create subCatsCreate calling--------------- : ' + JSON.stringify(req.body));
  var subcat = new SubCats(req.body);
  subcat.catId = req.params.newCatId;




  AWS.config = new AWS.Config();
  AWS.config.accessKeyId = config.AWS_ACCESS_KEY_ID;
  AWS.config.secretAccessKey = config.AWS_SECRET_ACCESS_KEY;
  AWS.config.region = 'us-east-1';
  var s3 = new AWS.S3();
  var file = req.files.file;




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
      if (file) {
        var path = file.path;
        fs.readFile(path, function (err, file_buffer) {
          var params = {
            Bucket: 'NewRFSubCats',
            Key: req.body.imageName,
            Body: file_buffer,
            ContentType: file.type,
            ACL: 'public-read'
          };
          s3.putObject(params, function (perr, pres) {
            if (perr) {
              console.log("Error uploading data: ", perr);
            } else {
              res.json(subcat);
            }
          });
        });
      } else {
        res.json(subcat);
      }
    }
  });
};


/**
 * List of Subcats
 */

exports.listOfSubCats = function (req, res) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  // console.log('listOfSubCats calling---------------');
  //  console.log('listOfSubCats called and CAt model is : --------------- ' + JSON.stringify(req.category));
  var catResult = req.category.toObject();
  //catResult.recipeCount = 462;
  catResult.subCats = [];

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
    SubCats.find({
      catId: req.params.newCatId,
      active: {
        $in: activeFltrFlgs
      }
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
    //  console.log('listOfSubCats calling-------PageId-------- : ' + req.params.pageId);

    SubCats.find({
      catId: req.params.newCatId,
      active: {
        $in: activeFltrFlgs
      }
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
  // console.log('Updated func in rest : ' + JSON.stringify(req.body));

  subcat = _.extend(subcat, req.body);

  AWS.config = new AWS.Config();
  AWS.config.accessKeyId = config.AWS_ACCESS_KEY_ID;
  AWS.config.secretAccessKey = config.AWS_SECRET_ACCESS_KEY;
  AWS.config.region = 'us-east-1';
  var s3 = new AWS.S3();
  var file = req.files.file;


  subcat.save(function (err) {
    if (err) {
      console.log('Err Updated func in rest : ' + JSON.stringify(err));
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
      //res.json(subcat);


      if (file) {
        //console.log("uploaded data to NewRF");
        var params = {
          Bucket: 'NewRFSubCats',
          Key: req.body.imageName
        }
        s3.getObject(params, function (err, data) {
          if (err) {
            console.log(err, err.stack);
            var path = file.path;
            fs.readFile(path, function (err, file_buffer) {
              var params = {
                Bucket: 'NewRFSubCats',
                Key: req.body.imageName,
                Body: file_buffer,
                ContentType: file.type,
                ACL: 'public-read'
              };
              s3.putObject(params, function (perr, pres) {
                if (perr) {
                  console.log("Error uploading data: ", perr);
                } else {
                  res.json(subcat);
                  //     console.log("Successfully uploaded data to NewRFSubCats");
                }
              });
            });

          } else {
            //  console.log('Image exists in AWS : ' + data); // successful response
            //  console.log('Copy source is  : ** :' + 'NewRFSubCats' + '/' + req.body.imageName + '.jpg' + ' : **'); // successful response
            var copyParams = {
              CopySource: '/NewRFSubCats/' + req.body.imageName,
              Bucket: 'archiverf',
              Key: req.body.imageName + Date.now(),
              ContentType: file.type,
              ACL: 'public-read'
            }
            s3.copyObject(copyParams, function (err, data) {
              if (err) console.log(err, err.stack); // an error occurred
              else {
                // console.log('Success fully copied image :' + data);
                var delParams = {
                  Bucket: 'NewRFSubCats',
                  Key: req.body.imageName
                }
                s3.deleteObject(delParams, function (err, data) {
                  if (err) console.log(err, err.stack); // an error occurred
                  else {
                    //upload the image into AWS
                    var path = file.path;
                    fs.readFile(path, function (err, file_buffer) {
                      var params = {
                        Bucket: 'NewRFSubCats',
                        Key: req.body.imageName,
                        Body: file_buffer,
                        ContentType: file.type,
                        ACL: 'public-read'
                      };
                      s3.putObject(params, function (perr, pres) {
                        if (perr) {
                          console.log("Error uploading data: ", perr);
                        } else {
                          res.json(subcat);
                          //       console.log("Successfully uploaded data to NewRFSubCats");
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
        res.json(subcat);
      }



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

  //console.log('SubcatID is called : ' + id);


  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  //console.log('read single SubCat by id');
  /*  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: 'SubCat is invalid'
      });
    }*/
  /*  SubCats.findById(id).exec(function (err, subcat) {
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
    });*/
  SubCats.findOne({
    subCatId: id
  }).exec(function (err, subcat) {
    if (err) return next(err);
    if (!subcat) {
      return res.status(404).send({
        message: 'subcat not found'
      });
    }
    //user is successfully Single cat save action into user usage details collection
    agenda.now('User_Usage_Details', {
      email: emailInfo,
      device: deviceInfo,
      action: 'subCatByID : ' + subcat.displayName
    });
    req.subcat = subcat;
    next();
  });




};
