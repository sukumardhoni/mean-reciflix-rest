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


	app.route('/VRecipesByTags/:tagName')
	.get(vrecipes.getVIdRecipesByTags);

	app.route('/Vrecipes/Categories/tags/:pageId')
	.get(vrecipes.getAllTags);

	app.route('/vRecipesAllCategories/:pageId')
	.get(vrecipes.getAllCategories);

	app.route('/VRecipesByCategories/:CategoryName/:pageId')
	.get(vrecipes.getVIdRecipesByCategories);

  app.route('/VRecipesByViews/:maxViews/:minViews')
	.get(vrecipes.getVIdRecipesByViews);

	app.route('/VRecipesByViewsAndTags/:maxViews/:minViews/:maxLikes/:minLikes/:tags')
	.get(vrecipes.getVIdRecipesByViewsAndTags);

	app.route('/myFavoritesVRecipes/:videoIds')
	.get(vrecipes.getAllMyFavoriteVRecipes);

	app.route('/initialize')
  .post(vrecipes.postSampleJSONData);
/*app.route('/VRecipesByViews/:maxViews/:minViews')
	.get(vrecipes.getVIdRecipesByViews);*/

};
