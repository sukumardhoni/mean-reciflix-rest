'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  subcats = require('../../app/controllers/subcats.server.controller'),
  multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty();

module.exports = function (app) {
  // SubCats Routes
  app.route('/subCats/:newCatId/:pageId/:activeFilter')
    .get(cache.route(), subcats.listOfSubCats)
    .post(users.ensureAuthenticated, multipartyMiddleware, subcats.subCatCreate);

  app.route('/singleSubCat/:subCatId')
    .get(users.ensureAuthenticated, subcats.getSubCat)
    .post(users.ensureAuthenticated, multipartyMiddleware, subcats.updateSubCat)
    .delete(users.ensureAuthenticated, subcats.deleteSubCat);

  // Finish by binding the subcats middleware
  app.param('subCatId', subcats.subCatByID);
};
