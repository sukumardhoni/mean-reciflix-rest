'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  groceries = require('../../app/controllers/glist.server.controller');

module.exports = function (app) {
  // Grocery Routes
  app.route('/glist')
    .get(users.ensureAuthenticated, groceries.listOfGlist)
    .post(users.ensureAuthenticated, groceries.glistcreate);

  app.route('/glist/:glistId')
    .get(users.ensureAuthenticated, groceries.glistread)
    .put(users.ensureAuthenticated, groceries.glistupdate)
    .delete(users.ensureAuthenticated, groceries.glistdelete);

  /*app.route('/groceriesWithActiveOrCompleted/:active/:completed')
    .get(users.ensureAuthenticated, groceries.readactive)*/



  // Finish by binding the grocery middleware
  app.param('glistId', groceries.glistByID);
};
