'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('../errors.server.controller.js'),
  mongoose = require('mongoose'),
  UsersSuggestions = mongoose.model('Suggestions'),
  config = require('../../../config/config'),
  agenda = require('../../../schedules/job-schedule.js')(config.db);






/**
 * Create a Suggestion
 */


exports.CreateSuggestion = function (req, res) {
  console.log('### CreateSuggestion is called');

  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  console.log("reached the create suggestion received: " + JSON.stringify(req.body));
  var suggestion = new UsersSuggestions(req.body);

  suggestion.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //user is successfully created suggestion save action into user usage details collection
      agenda.now('User_Usage_Details', {
        email: emailInfo,
        device: deviceInfo,
        action: 'CreateSuggestion'
      });
      agenda.now('User_Suggestion_Details', {
        userData: '\n Email: ' + suggestion.email + '\n Suggestions: ' + suggestion.suggestions + '\n Came from :' + deviceInfo + '\n'
      });
      //console.log("successfully created suggestion: " + JSON.stringify(suggestion));
      res.json(suggestion);
    }
  });



};

exports.ListOfSuggestions = function (req, res) {
  console.log('### ListOfSuggestions is called');
  var bearer = req.params.pageId.split('US');
  UsersSuggestions.find().skip(bearer[0] * 5).limit(5).sort('-time.date').exec(function (err, suggestions) {
    if (err) {
      // console.log('@@@@@@@@@ Error at categories list fetching : ' + err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var SugColObj = req.SugColObj;
      SugColObj.suggestions = suggestions;
      res.json(SugColObj);
    }
  });

};



exports.totalSuggestions = function (req, res, next) {
  var SugColObj = {};
  SugColObj.suggestions = [];

  var bearer = req.params.pageId.split('US');
  if (bearer[1] === '') {
    console.log('Users usage count for If part  : ' + bearer[1]);
    UsersSuggestions.find().exec(function (err, suggestions) {
      if (err) {
        // console.log('@@@@@@@@@ Error at categories list fetching : ' + err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        SugColObj.count = suggestions.length;
        req.SugColObj = SugColObj;
        console.log('### usersCount is total collection : ' + JSON.stringify(req.SugColObj));
        next();
      }
    });
  } else {
    console.log('Users usage count for  Else part : ' + bearer[1]);
    SugColObj.count = bearer[1];
    req.SugColObj = SugColObj;
    console.log('### usersCount is total collection : ' + JSON.stringify(req.SugColObj));
    next();
  };

};
