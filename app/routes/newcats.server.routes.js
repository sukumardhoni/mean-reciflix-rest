'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  categories = require('../../app/controllers/newcats.server.controller'),
  multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty(),
  config = require('../../config/config');
  /*cache = require('express-redis-cache')({
    client: require('redis').createClient(config.redis.uri)
  })*/

module.exports = function (app) {

  /*users.ensureAuthorized,users.checkingUser,*/


  //TODO is the method users.ensureAuthorized  can rename to users.ensureAuthenticated ?

  // Category Routes

  app.route('/newcats/page/:pageId/:activeFilter')
    .get( categories.listOfCats);
    /*.get(cache.route(), categories.listOfCats);*/


  app.route('/newCatAndSubCats/:rank')
    .get(categories.singleCatByRank);

  //admin functions are shown here //

  /*  app.route('/categories/admincats')
      .get(categories.catslist);*/

  app.route('/newcats')
    .post(users.ensureAuthenticated, users.checkAdmin, multipartyMiddleware, categories.createCat);

  app.route('/newcats/:newCatId')
    .get(categories.read)
    .post(users.ensureAuthenticated, multipartyMiddleware, categories.updateCat)
    .delete(users.ensureAuthenticated, categories.deleteCat);

  /*	app.route('/categories/page/:pageId')
			.get(categories.read);*/



  // Finish by binding the category middleware
  app.param('newCatId', categories.categoryByID);
  //  app.param('pageId', categories.byPageID);
};
