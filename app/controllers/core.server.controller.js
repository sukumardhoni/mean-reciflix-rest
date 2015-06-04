'use strict';

var _ = require('lodash');

require('pkginfo')(module, 'name', 'description', 'author', 'version');

/**
 * Module dependencies.
 */
exports.index = function (req, res) {
  res.render('index', {
    user: req.user || null,
    request: req
  });
};

exports.live = function (req, res) {
  res.json(_.extend({
    'message': 'api is alive !'
  }, module.exports));
};
