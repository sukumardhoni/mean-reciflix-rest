'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  subcats = require('../../app/controllers/subcats.server.controller');

module.exports = function (app) {
  // SubCats Routes
  app.route('/subCats/:catId/:pageId')
    .get(users.ensureAuthenticated, subcats.listOfSubCats)
    .post(users.ensureAuthenticated, subcats.subCatsCreate);

  app.route('/singleSubCat/:subCatId')
    .get(users.ensureAuthenticated, subcats.getSingleSubCat)
    .put(users.ensureAuthenticated, subcats.updateSingleSubCat)
    .delete(users.ensureAuthenticated, subcats.deleteSingleSubCat);

  // Finish by binding the subcats middleware
  app.param('subCatId', subcats.subCatByID);
};
