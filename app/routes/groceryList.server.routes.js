'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  groceries = require('../../app/controllers/groceryList.server.controller');

module.exports = function (app) {
  // Grocery Routes
  app.route('/groceries')
    .get(users.ensureAuthenticated, groceries.listOfGroceries)
    .post(users.ensureAuthenticated, groceries.create);

  app.route('/groceries/:groceryId')
    .get(users.ensureAuthenticated, groceries.read)
    .put(users.ensureAuthenticated, groceries.update)
    .delete(users.ensureAuthenticated, groceries.delete);

  app.route('/groceriesWithActiveOrCompleted/:active/:completed')
    .get(users.ensureAuthenticated, groceries.readactive)



  // Finish by binding the grocery middleware
  app.param('groceryId', groceries.groceryByID);
};
