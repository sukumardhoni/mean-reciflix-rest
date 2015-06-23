'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  vrecipes = require('../../app/controllers/vrecipes.server.controller');

module.exports = function (app) {
  // Article Routes
  app.route('/vrecipes')
    .get(users.ensureAuthenticated, vrecipes.list)
    //		.post(users.requiresLogin, articles.create);
    .post(users.ensureAuthenticated, vrecipes.create);



  app.route('/vRecipes/:vrecipeId')
    .get(users.ensureAuthenticated, vrecipes.read)
    //		.put(users.requiresLogin, articles.hasAuthorization, articles.update)
    //		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);
    .put(users.ensureAuthenticated, vrecipes.update)
    .delete(users.ensureAuthenticated, vrecipes.delete);


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
    .get(users.ensureAuthenticated, vrecipes.getVIdRecipesByCategories);

  app.route('/VRecipesByCategoriesForAdmin/:CategoryName')
    .get(vrecipes.getVIdRecipesByCategories_Admin);

  app.route('/VRecipesByViews/:maxViews/:minViews')
    .get(vrecipes.getVIdRecipesByViews);

  app.route('/VRecipesByViewsAndTags/:maxViews/:minViews/:maxLikes/:minLikes/:tags')
    .get(vrecipes.getVIdRecipesByViewsAndTags);

  app.route('/myFavorites/:userId/:pageId')
    .get(users.ensureAuthenticated, vrecipes.getAllMyFavorites);

  app.route('/searchedVRecipes/:query/:pageId')
    .get(users.ensureAuthenticated, vrecipes.getAllSearchedVRecipes);

  app.route('/recipesFavCount/:recipeId')
    .put(users.ensureAuthenticated, vrecipes.updateVRecipesFavCount);


  app.route('/initialize')
    .post(vrecipes.postSampleJSONData);
  /*app.route('/VRecipesByViews/:maxViews/:minViews')
		.get(vrecipes.getVIdRecipesByViews);*/

};
