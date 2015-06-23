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
