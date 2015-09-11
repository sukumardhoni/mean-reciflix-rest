'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  subcats = require('../../app/controllers/subcats.server.controller');

module.exports = function (app) {
  // SubCats Routes
  app.route('/subCats/:newCatId/:pageId/:activeFilter')
    .get(subcats.listOfSubCats)
    .post(users.ensureAuthenticated, subcats.subCatCreate);

  app.route('/singleSubCat/:subCatId')
    .get(users.ensureAuthenticated, subcats.getSubCat)
    .put(users.ensureAuthenticated, subcats.updateSubCat)
    .delete(users.ensureAuthenticated, subcats.deleteSubCat);

  // Finish by binding the subcats middleware
  app.param('subCatId', subcats.subCatByID);
};
