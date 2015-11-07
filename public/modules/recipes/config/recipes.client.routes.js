'use strict';

// Setting up route
angular.module('recipes').config(['$stateProvider',
 function ($stateProvider) {
    // Recipes state routing
    $stateProvider.
    state('reciflix.recipes', {
      url: 'category',
      templateUrl: 'modules/recipes/views/recipes.html',
      controller: 'RecipesCtrl',
      module: ''
    })

    .state('reciflix.recipes.subcats', {
      url: "/:catId",
      views: {
        'child-view': {
          templateUrl: "modules/recipes/views/subCats.html",
          controller: 'SubCategoriesCtrl',
        }
      },
      module: 'private'
    })

    .state('reciflix.recipes.subcats.recipes', {
      url: "/:subCatId",
      views: {
        'child-recipes-view': {
          templateUrl: "modules/recipes/views/subCatsRecipes.html",
          controller: 'SubCatRecipesCtrl',
        }
      },
      module: 'private'
    })

    .state('reciflix.recipes.subcats.recipes.singlerecipes', {
      url: "/:recipeId",
      views: {
        'child-singlerecipes-view': {
          templateUrl: "modules/recipes/views/singleRecipe.html",
          controller: 'SubCatRecipesCtrl',
        }
      },
      module: 'private'
    })
 }
]);
