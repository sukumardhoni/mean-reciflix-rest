'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  groceries = require('../../app/controllers/glist.server.controller');

module.exports = function (app) {
  // Grocery Routes
  app.route('/gList')
    .get(users.ensureAuthenticated, groceries.listOfGLists)
    .post(users.ensureAuthenticated, groceries.createGList);

  app.route('/gList/:gListId')
    .get(users.ensureAuthenticated, groceries.singleGList)
    .put(users.ensureAuthenticated, groceries.updateGList)
    .delete(users.ensureAuthenticated, groceries.deleteGList);

  /*app.route('/groceriesWithActiveOrCompleted/:active/:completed')
    .get(users.ensureAuthenticated, groceries.readactive)*/

  // Finish by binding the grocery middleware
  app.param('gListId', groceries.gListByID);
};
