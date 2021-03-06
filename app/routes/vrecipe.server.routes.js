'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  vrecipes = require('../../app/controllers/vrecipes.server.controller'),
  config = require('../../config/config'),
  cache = require('express-redis-cache')({
    client: require('redis').createClient(config.redis.uri)
  });

module.exports = function (app) {
  // Recipes Routes
  app.route('/vrecipes')
    .get(vrecipes.list)
    //		.post(users.requiresLogin, articles.create);
    .post(vrecipes.create);



  app.route('/vRecipes/:vrecipeId')
    .get(vrecipes.getRecipe)
    //		.put(users.requiresLogin, articles.hasAuthorization, articles.update)
    //		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);
    /*    .put(users.ensureAuthenticated, vrecipes.updateRecipe)
        .delete(users.ensureAuthenticated, vrecipes.deleteRecipe);*/
    .put(vrecipes.updateRecipe)
    .delete(vrecipes.deleteRecipe);


  app.route('/nVRecipes')
    .get(vrecipes.list)
    //		.post(users.requiresLogin, articles.create);
    .post(vrecipes.create);


  app.route('/nVRecipes/:nVRecipeId')
    .get(vrecipes.getRecipe)
    //		.put(users.requiresLogin, articles.hasAuthorization, articles.update)
    //		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);
    .put(users.ensureAuthenticated, vrecipes.updateRecipe)
    .delete(users.ensureAuthenticated, vrecipes.deleteRecipe);


  // Finish by binding the vrecipe middleware
  app.param('vrecipeId', vrecipes.vrecipeByID);


  //New recipe based on recipeId
  app.param('nVRecipeId', vrecipes.nVRecipeByID);


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

  app.route('/WebFavRecipes/:uId/:pageId')
    .get(users.ensureAuthenticated, vrecipes.getAllWebFavorites);

  app.route('/searchedVRecipes/:query/:pageId')
    .get(vrecipes.getAllSearchedVRecipes);



  app.route('/searchedVRecipesByIndex/:query/:pageId')
    .get(cache.route(), vrecipes.getAllSearchedVRecipesByIndex);

  app.route('/searchedVRecipesByIndexNew/:query/:pageId')
    .get(cache.route(), vrecipes.getAllSearchedVRecipesByIndexNew);



  app.route('/recipesFavCount/:recipeId')
    .put(users.ensureAuthenticated, vrecipes.updateVRecipesFavCount);


  /*New Cats & sub cats routes for recipes*/


  app.route('/newRecipesForCatId/:newCatId/:pageId')
    .get(cache.route(), vrecipes.getRecipesByCats);

  app.route('/newRecipesForFilterCatId/:newCatId/:pageId')
    .get(vrecipes.getRecipesByFilterCats);

  app.route('/newRecipesForSubCatId/:subCatId/:pageId')
    .get(cache.route(), vrecipes.getRecipesBySubCats);

  app.route('/newRecipesForFilterSubCatId/:subCatId/:pageId')
    .get(vrecipes.getRecipesByFilterSubCats);

  app.route('/add-dataTo-subscriptionDb')
    .post(vrecipes.addDataToSubscriptionDb);

  app.route('/send-notificationTo-users')
    .post(vrecipes.sendWebNotifications);

  app.route('/delete-redis-cache')
    .get(vrecipes.deleteExpressRedis);



  app.route('/initialize')
    .post(vrecipes.postSampleJSONData);


  /*app.route('/VRecipesByViews/:maxViews/:minViews')
  	.get(vrecipes.getVIdRecipesByViews);*/

};
