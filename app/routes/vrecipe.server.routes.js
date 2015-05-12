'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	vrecipes = require('../../app/controllers/vrecipes.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/vrecipes')
		.get(vrecipes.list)
//		.post(users.requiresLogin, articles.create);
  		.post(vrecipes.create);



	app.route('/vrecipes/:vrecipeId')
		.get(vrecipes.read)
//		.put(users.requiresLogin, articles.hasAuthorization, articles.update)
//		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);
		.put(vrecipes.update)
		.delete(vrecipes.delete);


	// Finish by binding the vrecipe middleware
	app.param('vrecipeId', vrecipes.vrecipeByID);

  app.route('/cleanAllvrecipes')
  .delete(vrecipes.cleanAllVRecipes);

};
