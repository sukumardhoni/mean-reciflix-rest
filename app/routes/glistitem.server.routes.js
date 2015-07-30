'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  items = require('../../app/controllers/glistitem.server.controller');

module.exports = function (app) {
  // Grocery Routes
  app.route('/gListItems/:gListId/item')
    .get(users.ensureAuthenticated, items.listOfGlistItems)
    .post(users.ensureAuthenticated, items.gListItemCreate);

  app.route('/singleGListItem/:gListId/item/:itemId')
    .get(users.ensureAuthenticated, items.getSingleGListItem)
    .put(users.ensureAuthenticated, items.updateSingleGListItem)
    .delete(users.ensureAuthenticated, items.deleteSingleGListItem);

  // Finish by binding the grocery middleware
  app.param('itemId', items.gListItemByID);
};
