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
    .get(vrecipes.getRecipe)
    //		.put(users.requiresLogin, articles.hasAuthorization, articles.update)
    //		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);
    .put(users.ensureAuthenticated, vrecipes.updateRecipe)
    .delete(users.ensureAuthenticated, vrecipes.deleteRecipe);


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

  app.route('/VRecipesByCategoriesForAdmin/:CategoryName')
    .get(vrecipes.getVIdRecipesByCategories_Admin);

  app.route('/VRecipesByViews/:maxViews/:minViews')
    .get(vrecipes.getVIdRecipesByViews);

  app.route('/VRecipesByViewsAndTags/:maxViews/:minViews/:maxLikes/:minLikes/:tags')
    .get(vrecipes.getVIdRecipesByViewsAndTags);

  app.route('/myFavorites/:uId/:pageId')
    .get(users.ensureAuthenticated, vrecipes.getAllMyFavorites);

  app.route('/searchedVRecipes/:query/:pageId')
    .get(vrecipes.getAllSearchedVRecipes);

  app.route('/recipesFavCount/:recipeId')
    .put(users.ensureAuthenticated, vrecipes.updateVRecipesFavCount);


  /*New Cats & sub cats routes for recipes*/

  app.route('/newrecipes/:SubCatName/:pageId')
    .get(vrecipes.getRecipesBySubCats);

  app.route('/initialize')
    .post(vrecipes.postSampleJSONData);
  /*app.route('/VRecipesByViews/:maxViews/:minViews')
		.get(vrecipes.getVIdRecipesByViews);*/

};
