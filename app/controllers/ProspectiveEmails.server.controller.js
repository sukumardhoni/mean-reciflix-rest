'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('./errors.server.controller'),
  mongoose = require('mongoose'),
  ProspectiveEmail = mongoose.model('ProspectiveEmail');




/**
 * Create a ProspectiveEmail
 */
exports.create = function (req, res) {

  console.log('ProspectiveEmail create')
  console.log('ProspectiveEmail req.body' + JSON.stringify(req.body))
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

exports.list = function (req, res) {
  console.log('ProspectiveEmail list')

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
  console.log('ProspectiveEmail count')

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
