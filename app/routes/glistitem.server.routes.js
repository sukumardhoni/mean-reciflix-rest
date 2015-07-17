'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  items = require('../../app/controllers/glistitem.server.controller');

module.exports = function (app) {
  // Grocery Routes
  app.route('/glistitem/:glistIditem/item')
    .get(users.ensureAuthenticated, items.listOfGlistitems)
    .post(users.ensureAuthenticated, items.glistcreateitems);

  app.route('/glistitemsingle/:glistIditem/item/:itemId')
    .get(users.ensureAuthenticated, items.listOfGlistitemssingle)
    .put(users.ensureAuthenticated, items.glistupdateitemssingle)
    .delete(users.ensureAuthenticated, items.glistitemdeletesingle);


  app.route('/glistitemstate/:glistIditem/item/:state')
    .get(users.ensureAuthenticated, items.listOfGlistitemssinglebystate);


  // Finish by binding the grocery middleware
  app.param('itemId', items.glistitemByID);
};
