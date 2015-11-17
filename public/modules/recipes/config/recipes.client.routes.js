'use strict';

// Setting up route
angular.module('recipes').config(['$stateProvider',
 function ($stateProvider) {
    // Recipes state routing
    $stateProvider.
    state('reciflix.recipes', {
      url: 'category',
      templateUrl: 'modules/recipes/views/recipes.html',
      controller: 'RecipesCtrl'
    })



    .state('reciflix.recipes.subcats', {
      url: "/:catId/subcats",
      views: {
        'child-view@reciflix.recipes': {
          templateUrl: "modules/recipes/views/subCats.html",
          controller: 'SubCategoriesCtrl',
        }
      }
    })

    .state('reciflix.recipes.searchedrecipes', {
      url: "/searched/:query/recipes",
      views: {
        'child-view@reciflix.recipes': {
          templateUrl: "modules/recipes/views/searchedRecipes.html",
          controller: 'SearchedRecipesCtrl',
        }
      }
    })


    .state('reciflix.recipes.catrecipes', {
      url: "/:CatIdForRecipes/recipes",
      views: {
        'child-view@reciflix.recipes': {
          templateUrl: "modules/recipes/views/subCatsRecipes.html",
          controller: 'SubCatRecipesCtrl',
        }
      }
    })


    .state('reciflix.recipes.subcats.recipes', {
      url: "/:subCatId",
      views: {
        'child-recipes-view@reciflix.recipes.subcats': {
          templateUrl: "modules/recipes/views/subCatsRecipes.html",
          controller: 'SubCatRecipesCtrl',
        }
      }
    })



    .state('reciflix.recipes.subcats.recipes.singlerecipes', {
      url: "/:recipeId",
      views: {
        'child-singlerecipes-view': {
          templateUrl: "modules/recipes/views/singleRecipe.html",
          controller: 'SubCatRecipesCtrl',
        }
      }
    })
 }
]);
