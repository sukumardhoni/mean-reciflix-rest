'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  categories = require('../../app/controllers/newcats.server.controller');

module.exports = function (app) {

  /*users.ensureAuthorized,users.checkingUser,*/


  //TODO is the method users.ensureAuthorized  can rename to users.ensureAuthenticated ?

  // Category Routes

  app.route('/newcats/page/:pageId')
    .get(categories.list);

  //admin functions are shown here //

  /*  app.route('/categories/admincats')
      .get(categories.catslist);*/

  app.route('/newcats')
    .post(users.ensureAuthenticated, users.checkAdmin, categories.create);

  /* app.route('/newcategories')
     .post(categories.createnewcategory);*/


  app.route('/newcats/:newCatId')
    .get(categories.read)
    .put(users.ensureAuthenticated, categories.update)
    .delete(users.ensureAuthenticated, categories.delete);

  /*	app.route('/categories/page/:pageId')
			.get(categories.read);*/



  // Finish by binding the category middleware
  app.param('newCatId', categories.categoryByID);
  //  app.param('pageId', categories.byPageID);
};