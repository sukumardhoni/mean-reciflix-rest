'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	categories = require('../../app/controllers/categories.server.controller');

module.exports = function (app) {

	/*userController.ensureAuthorized,userController.checkingUser,*/


	// Category Routes
	app.route('/categories/:pageId')
		.get(users.ensureAuthorized, users.checkingUser, categories.list)
		.post(users.requiresLogin, categories.create);

	app.route('/categories/:categoryId')
		.get(categories.read)
		.put(users.requiresLogin, categories.hasAuthorization, categories.update)
		.delete(users.requiresLogin, categories.hasAuthorization, categories.delete);

	/*	app.route('/categories/page/:pageId')
			.get(categories.read);*/



	// Finish by binding the category middleware
	app.param('categoryId', categories.categoryByID);
	//  app.param('pageId', categories.byPageID);
};
