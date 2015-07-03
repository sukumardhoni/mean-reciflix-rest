'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  categories = require('../../app/controllers/categories.server.controller');

module.exports = function (app) {

  /*users.ensureAuthorized,users.checkingUser,*/


  //TODO is the method users.ensureAuthorized  can rename to users.ensureAuthenticated ?

  // Category Routes

  app.route('/categories/page/:pageId')
    .get(categories.list)

  //admin functions are shown here //

  app.route('/categories/admincats')
    .get(categories.catslist)

  app.route('/categories')
    .post(users.ensureAuthenticated, users.checkAdmin, categories.create);

  app.route('/newcategories')
    .post( categories.createnewcategory);


  app.route('/categories/:categoryId')
    .get(categories.read)
    .put(users.ensureAuthenticated, categories.update)
    .delete(users.ensureAuthenticated, categories.delete);

  /*	app.route('/categories/page/:pageId')
			.get(categories.read);*/



  // Finish by binding the category middleware
  app.param('categoryId', categories.categoryByID);
  //  app.param('pageId', categories.byPageID);
};
