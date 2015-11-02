'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('./errors.server.controller'),
  mongoose = require('mongoose'),
  ProspectiveEmail = mongoose.model('ProspectiveEmail'),
  config = require('../../config/config'),
  agenda = require('../../schedules/job-schedule.js')(config.db);


/**
 * Create a ProspectiveEmail
 */
exports.create = function (req, res) {
  var email = new ProspectiveEmail(req.body);
  email.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(email);
    }
  });
};


exports.gtmEmail = function (req, res) {

  console.log('Email from gtm site');
  console.log('Email form details : ' + JSON.stringify(req.body));
  var clientInfo = req.body;

  agenda.now('Client_Info_To_GTM', {
    userData: '\n Email: ' + clientInfo.email + '\n Name: ' + clientInfo.name + '\n Phone No :' + clientInfo.phone + '\n Message :' + clientInfo.message + '\n'
  });


  res.json(req.body);


};


exports.list = function (req, res) {
  ProspectiveEmail.find({}).exec(function (err, emails) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.send(emails);
    }

  });

};

exports.count = function (req, res) {
  ProspectiveEmail.find({
    'platform': req.params.platform
  }).exec(function (err, emails) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.send({
        'platform': req.params.platform,
        'count': emails.length
      });
    }
  });

};
