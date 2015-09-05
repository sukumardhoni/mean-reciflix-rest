'use strict';

// Setting up route
angular.module('recipes').config(['$stateProvider',
 function ($stateProvider) {
    // Recipes state routing
    $stateProvider.
    state('reciflix.recipes', {
      url: '/recipes',
      templateUrl: 'modules/recipes/views/recipes.html',
      controller: 'RecipesCtrl',
      module: 'private'
    })

    .state('reciflix.recipes.subcats', {
      url: "/:cat_Id/:catId/:catName",
      views: {
        'child-view': {
          templateUrl: "modules/recipes/views/subCats.html",
          controller: 'SubCategoriesCtrl',
        }
      },
      module: 'private'
    })

    .state('reciflix.recipes.subcats.recipes', {
      url: "/:subCatId/:SubCatName/recipes",
      views: {
        'child-recipes-view': {
          templateUrl: "modules/recipes/views/subCatsRecipes.html",
          controller: 'SubCatRecipesCtrl',
        }
      },
      module: 'private'
    })

    .state('reciflix.recipes.subcats.recipes.singlerecipes', {
      url: "/singlerecipes/:recipeId",
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
