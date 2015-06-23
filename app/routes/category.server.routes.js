'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  categories = require('../../app/controllers/categories.server.controller');

module.exports = function (app) {
  app.route('/categories/page/:pageId')
    .get(categories.list);

  app.route('/categories')
    .post(users.ensureAuthenticated, users.checkAdmin, categories.create);

  app.route('/categories/:categoryId')
    .get(categories.read)
    .put(users.ensureAuthenticated, users.checkAdmin, categories.update)
    .delete(users.ensureAuthenticated, users.checkAdmin, categories.delete);

  // Finish by binding the category middleware
  app.param('categoryId', categories.categoryByID);
};
