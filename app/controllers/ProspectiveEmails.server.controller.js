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
  var ProspectiveEmails = new ProspectiveEmail(req.body);

  ProspectiveEmails.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ProspectiveEmails);
    }
  });
};

exports.list = function (req, res) {
  console.log('ProspectiveEmail list')

  ProspectiveEmail.find({
    'platform': req.params.platform
  }).exec(function (err, emails) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (emails.length === 0) {
      res.send({
        message: 'There is no emails subscribed for this platform'
      })
    } else {
      res.json(emails);
    }

  });

};
