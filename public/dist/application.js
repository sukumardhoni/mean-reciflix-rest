'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'reciflixApp';
  var applicationModuleVendorDependencies = ['ngResource', 'ngCookies', 'ngAnimate', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'ui.utils', 'ngStorage', 'ngFileUpload'];

  //['ngResource', 'ui.router', 'ui.bootstrap', 'ui.select', 'ui.utils', 'ngStorage']

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
 function ($locationProvider) {
   // $locationProvider.hashPrefix('!');
   //$locationProvider.html5Mode(true);
 }
]).run(["$rootScope", "$state", "$localStorage", "$http", function ($rootScope, $state, $localStorage, $http) {
  var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
  var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
  var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
  var is_safari = navigator.userAgent.indexOf("Safari") > -1;
  var is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
  var browser = '';
  if ((is_chrome) && (is_safari)) {
    browser = 'Chrome';
  } else if ((is_chrome) && (is_opera)) {
    browser = 'Opera';
  } else if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
    browser = 'Safari';
  } else if (is_firefox) {
    browser = 'Firefox';
  } else if (is_explorer) {
    browser = 'Explorer';
  }

  var currentUser = $localStorage.user;

  var userEmail = 'guest, ip : ' + geoplugin_request();
  if (currentUser) {
    userEmail = currentUser.email;
  }


  //console.log('$localStorage.user.email is : ' + userEmail);

  $http.defaults.headers.common['Device'] = 'Web,' + browser;
  $http.defaults.headers.common['Email'] = userEmail + ', country :'+geoplugin_countryName();

  $rootScope.$state = $state;
  /*$rootScope.$on('$stateChangeStart',
    function (e, toState, toParams, fromState, fromParams) {
      if (toState.module === 'private' && !$localStorage.user) {
        // If logged out and transitioning to a logged in page:
        e.preventDefault();
        $state.go('signin');
      } else if (toState.module === 'public' && $localStorage.user) {
        // If logged in and transitioning to a logged out page:
        e.preventDefault();
        $state.go('reciflix.recipes');
      };
    });*/

}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  //if (window.location.hash === '#_=_') window.location.hash = '#!';
 // if (window.location.hash === '#_=_') window.location.hash = '#';

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('articles');

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('categories');

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('recipes');

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
 function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
    Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
    Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
 }
]);

'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
 function ($stateProvider) {
    // Articles state routing
    $stateProvider.
    state('listArticles', {
      url: '/articles',
      templateUrl: 'modules/articles/views/list-articles.client.view.html'
    }).
    state('listArticles.users', {
      url: '/users',
      views: {
        'user.detail': {
          templateUrl: 'modules/articles/views/create-article.client.view.html'
        }
      }
    }).
    state('listArticles.categories', {
      url: '/categories',
      views: {
        'user.categories': {
          templateUrl: 'modules/articles/views/edit-article.client.view.html'
        }
      }
    }).
    state('listArticles.createcategories', {
      url: '/createcategories',
      views: {
        'user.categories': {
          templateUrl: 'modules/articles/views/createcategories.client.view.html'
        }
      }
    }).
    state('listArticles.recipes', {
      url: '/recipes',
      views: {
        'user.recipes': {
          templateUrl: 'modules/articles/views/view-article.client.view.html'
        }
      }
    });
 }
]);

'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Vrecipes', '$localStorage', '$http',
 function ($scope, $stateParams, $location, Authentication, Vrecipes, $localStorage, $http) {
    //console.log('articals page');


   //console.log('createcategories Title create function is called : ' + $localStorage.token);
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;

    $scope.authentication = Authentication;

    //console.log('type of user ------------' + JSON.stringify($scope.authentication));

    $scope.categories = function () {

      //console.log('categories -----------');


      Vrecipes.getcategory.query({

      }, function (res) {


        $scope.categories = res;
        //console.log('list of categories' + JSON.stringify(res));

      });



    };


    $scope.sample = [{
      value: '1',
      name: 'nonveg'
}, {
      value: '2',
      name: 'vegetarian'
}, {
      value: '3',
      name: 'seafood'
}, {
      value: '4',
      name: 'snacks'
}, {
      value: '5',
      name: 'fastfood'
}, {
      value: '6',
      name: 'healthy'
}, {
      value: '7',
      name: 'specials'
}, {
      value: '8',
      name: 'kids'
}, {
      value: '9',
      name: 'beverages'
}, {
      value: '10',
      name: 'regional'
}, {
      value: '11',
      name: 'desserts'
}, {
      id: '12',
      name: 'dairy'
}, {
      id: '13',
      name: 'chutneysoups'
}, {
      value: '14',
      name: 'appetizers'
}, {
      value: '15',
      name: 'kicthentips'
}];






    $scope.createcategories = function () {

      //console.log('createcategories -----------');



      $scope.newcat = function () {



        var categorie = {
          'catId': this.categorie.catId,
          'displayName': this.categorie.displayName,
          'imageName': this.categorie.imageName,

        };
        Vrecipes.savecategory.save(categorie, function (result) {

          /*$scope.persons.push({
            name: result.name,
              _id:result._id
        });*/

          $scope.categorie = '';

        });

      };





    };






    $scope.availableTags = ['Chicken', 'Mutton', 'Veg', 'Non-veg', 'Curry', 'Gravy', 'Salads', 'Desserts', 'Cake', 'Sweets', 'Snacks', 'Appetizers', 'Breads', 'Dipping Sides', 'Kids', 'Festival', 'Diwali', 'Ganesh Festival', 'Sankranthi', 'Rakhi', 'Dushera', 'Healthy', 'Indo chineese', 'South Indian Recipes', 'Soup', 'Chutney', 'Indian Pickels', 'Pregnancy Diet', 'Egg Less', 'SandWhich', 'Fruit', 'Special', 'Hot Drinks', 'Soft Drinks', 'Lunch', 'Break Fast', 'Pasta', 'Ice-Creams', 'Chat', 'Pickle', 'North-Indian', 'Spreads', 'Rice', 'Cashews Special', 'Paratha', 'Chineese', 'Rajasthani', 'Naan', 'Roti', 'Milk', 'Biriyani', 'Pulao', 'Cookies', 'Kitchen Requirements', 'Mushroom', 'Pizza', 'Bakery', 'Chocolates'];


    $scope.availableCats = ['Chicken', 'Mutton', 'Veg', 'nonveg', 'Curry', 'Gravy', 'Salads', 'Desserts', 'Cake', 'Sweets', 'Snacks', 'Appetizers', 'Breads', 'Dipping Sides', 'Kids', 'Festival', 'Diwali', 'Ganesh Festival', 'Sankranthi', 'Rakhi', 'Dushera', 'Healthy', 'Indo chineese', 'South Indian Recipes', 'Soup', 'Chutney', 'Indian Pickels', 'Pregnancy Diet', 'Egg Less', 'SandWhich', 'Fruit', 'Special', 'Hot Drinks', 'Soft Drinks', 'Lunch', 'Break Fast', 'Pasta', 'Ice-Creams', 'Chat', 'Pickle', 'North-Indian', 'Spreads', 'Rice', 'Cashews Special', 'Paratha', 'Chineese', 'Rajasthani', 'Naan', 'Roti', 'Milk', 'Biriyani', 'Pulao', 'Cookies', 'Kitchen Requirements', 'Mushroom', 'Pizza', 'Bakery', 'Chocolates'];



    $scope.selected = function () {

        //console.log('selected item' + this.categoriesname);

        Vrecipes.getrecipes.query({
          CategoryName: this.categoriesname

        }, function (res) {

          //console.log('particular recipeslist' + JSON.stringify(res));
          $scope.recipes = res;
          //console.log('selected item' + JSON.stringify(res));

          $scope.totalItems = $scope.recipes.length;
          $scope.itemsPerPage = 1;
          $scope.currentPage = 1;
          $scope.maxSize = 5;


          $scope.pageCount = function () {
            return Math.ceil($scope.recipes.length / $scope.itemsPerPage);
          };

          $scope.$watch('currentPage + itemsPerPage', function () {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
              end = begin + $scope.itemsPerPage;

            $scope.filteredrecipe = $scope.recipes.slice(begin, end);
          });

        });

      },

      // Find existing Article
      /*$scope.recipeslist = function () {


        console.log('recipeslist -----------');

        Vrecipes.getrecipes.query({



          },
          function (data) {
            console.log('particular recipeslist' + JSON.stringify(data));
            $scope.recipes = data;


            $scope.totalItems = $scope.recipes.length;
            $scope.itemsPerPage = 1
            $scope.currentPage = 1;
            $scope.maxSize = 5;


            $scope.pageCount = function () {
              return Math.ceil($scope.recipes.length / $scope.itemsPerPage);
            };

            $scope.$watch('currentPage + itemsPerPage', function () {
              var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                end = begin + $scope.itemsPerPage;

              $scope.filteredrecipe = $scope.recipes.slice(begin, end);
            });

          });

      };
*/

      $scope.updaterecipes = function (recipe) {
        var updatedRecipe = recipe;
        updatedRecipe.submitted.by = 'reciflix_admin';
        updatedRecipe.state = 123;

        Vrecipes.updaterecipes.update({
          vrecipeId: updatedRecipe._id
        }, updatedRecipe, function (result) {

        }, function (err) {
          //console.log('Update recipe error : ' + JSON.stringify(err));

        });
      };

    $scope.removeRecipes = function (recipe) {

      console.log('inside removeRecipes');
      var updatedRecipe = recipe;
      updatedRecipe.submitted.by = 'reciflix_admin';
      updatedRecipe.state = 333;

      Vrecipes.updaterecipes.update({
        vrecipeId: updatedRecipe._id
      }, updatedRecipe, function (result) {
        //console.log('Remove Recipe details Successfully   ' + JSON.stringify(result));

      }, function (err) {
        //console.log('Update recipe error : ' + JSON.stringify(err));

      });
    };









 }
]);


angular.module('articles').directive('myYoutube', ["$sce", function ($sce) {
  return {
    restrict: 'EA',
    scope: {
      code: '='
    },
    replace: true,
    template: '<div style="height:350px; width:100%"><iframe style="overflow:hidden;height:100%;width:70%" controls="0" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
    link: function (scope) {
      console.log('here');
      scope.$watch('code', function (newVal) {
        if (newVal) {
          scope.url = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + newVal);
        }
      });
    }
  };
}]);

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Vrecipes', ['$resource',
 function ($resource) {

    return {

      getrecipes: $resource('/VRecipesByCategoriesForAdmin/:CategoryName', {
        CategoryName: '@CategoryName'
      }, {
        'query': {
          method: 'GET',
          isArray: true
        }
      }),


      updaterecipes: $resource('/vrecipes/:vrecipeId', {
        vrecipeId: '@vrecipeId'
      }, {
        'update': {
          method: 'PUT'
        }
      }),


      getcategory: $resource('/categories/admincats', {}, {
        'query': {
          method: 'GET',
          isArray: true
        }
      }),

      savecategory: $resource('/newcategories', {}, {
        'save': {
          method: 'POST'
        },
      }),

    };


 }
]);

'use strict';

// Configuring the Articles module
angular.module('categories').run(['Menus',
 function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Categories', 'categories', 'dropdown', '/categories(/create)?');
    Menus.addSubMenuItem('topbar', 'categories', 'List Articles', 'categories');
    Menus.addSubMenuItem('topbar', 'categories', 'New Category', 'categories/create');
 }
]);

'use strict';

// Setting up routes for categories
angular.module('categories').config(['$stateProvider', '$urlRouterProvider',
 function ($stateProvider, $urlRouterProvider) {
    // Home state routing
    $stateProvider
      .state('reciflix', {
        url: '/',
        templateUrl: 'modules/categories/views/common/content.html',
        controller: 'ReciflixCtrl',
        data: {
          bodyClass: ''
        }
      })
      .state('reciflix.recipesUpdate', {
        url: "recipes/update",
        templateUrl: "modules/categories/views/recipesUpdate.html",
        controller: 'RecipesUpdateCtrl'
      })
      .state('reciflix.categories', {
        url: "categories",
        templateUrl: "modules/categories/views/categories.html",
        controller: 'CategoryCtrl',
        module: 'private'
      })
      .state('reciflix.categories.subcats', {
        url: "/:catId/subcats",
        views: {
          'child-view': {
            templateUrl: "modules/categories/views/subCats.html",
            controller: 'SubCatCtrl',
          }
        },
        module: 'private'
      })
}])

.run(["$rootScope", "$state", "$stateParams", function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
}]);

'use strict';

// Categories controller
angular.module('categories').controller('ReciflixCtrl', ['$scope', '$state', '$localStorage', '$location', '$http', 'Authentication', function ($scope, $state, $localStorage, $location, $http, Authentication) {
  $scope.authentication = Authentication;

  var currentUser = $localStorage.user;

  var userDisplayName = 'Guest';
  if (currentUser) {
    userDisplayName = $localStorage.user.displayName;
  }



  $scope.userName = userDisplayName;
  $scope.localUser = $localStorage.user;
  $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;

  $scope.signout = function () {
    $http.post('/users/signout').success(function (response) {
      //console.log(response.data);
      $scope.authentication = '';
      delete $localStorage.token;
      delete $localStorage.user;
      $state.go('signin');
    });
  };

  $scope.minimalize = function () {
    $("body").toggleClass("mini-navbar");
    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {

      // Hide menu in order to smoothly turn on when maximize menu
      $('#side-menu').hide();
      // For smoothly turn on menu
      setTimeout(
        function () {
          $('#side-menu').fadeIn(500);
        }, 100);
    } else if ($('body').hasClass('fixed-sidebar')) {

      $('#side-menu').hide();
      setTimeout(
        function () {
          $('#side-menu').fadeIn(500);
        }, 300);
    } else {
      // Remove all inline style from jquery fadeIn function to reset menu state
      $('#side-menu').removeAttr('style');
    }
  }
}])

.controller('CategoryCtrl', ["$scope", "$localStorage", "$state", "Categories", "$modal", "SingleCat", "NotificationFactory", "Upload", function ($scope, $localStorage, $state, Categories, $modal, SingleCat, NotificationFactory, Upload) {
  //activeFilter 1= Active, 2=InActive, 3=All
  $scope.categoryFun = function () {
    Categories.query({
      pageId: 999,
      activeFilter: 3
    }).$promise.then(function (res) {
      $scope.categories = res;
    }).catch(function (err) {
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };

  $scope.openModal = function () {
    $scope.cat = '';
    $scope.modalName = "Create Category";
    $scope.modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/create-cat-modal.html',
      controller: 'CategoryCtrl',
      scope: $scope
    });
  };

  $scope.editCat = function (cat, index) {
    $scope.modalName = "Update Category";
    $localStorage.indexVal = index;
    $scope.modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/create-cat-modal.html',
      scope: $scope,
      controller: 'CategoryCtrl'
    });
    $scope.getCatDetails(cat);

  };

  $scope.displayCat = function (cat) {
    $scope.modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/view-cat-modal.html',
      scope: $scope,
      controller: 'CategoryCtrl'
    });
    $scope.getCatDetails(cat);
  }

  $scope.getCatDetails = function (cat) {
    SingleCat.get({
      newCatId: cat.catId
    }, function (res) {
      $scope.cat = res;
    }, function (err) {
      //console.log('Error occured while fetching category, Error details are : ' + JSON.stringify(err));
    });
  };

  $scope.setFile = function (element) {
    $scope.$apply(function ($scope) {
      $scope.theFile = element.files[0];
      console.log('Successfully fetched the image file ' + JSON.stringify($scope.theFile));

    });
  };


  $scope.createCat = function () {
    // console.log('Successfully fetched the image file ' + JSON.stringify($scope.cat));
    Upload.upload({
      url: 'http://www.reciflix.com/newcats',
      file: $scope.cat.picFile,
      data: $scope.cat
    }).then(function (resp) {
      $scope.categories.unshift(resp.data);
      $scope.modalInstance.close();
      console.log('Success ' + resp.config.data.file.name + ', uploaded. Response: ' + JSON.stringify(resp.data));
      console.log('Success uploaded. Response: ' + JSON.stringify(resp));
    }, function (resp) {
      console.log('Error status: ' + resp.status);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });

    /*    SingleCat.save($scope.cat, function (res) {

          Upload.upload({
            url: 'http://localhost:3000/uploadImageToAWS',
            file: $scope.cat.picFile,
            data: $scope.cat
          }).then(function (resp) {
            $scope.categories.push(res);
            $scope.modalInstance.close();
            console.log('Success ' + resp.config.data.file.name + ', uploaded. Response: ' + JSON.stringify(resp.data));
          }, function (resp) {
            console.log('Error status: ' + resp.status);
          }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
          });



        }, function (err) {
          //console.log('Error occured while creating category, Error details are : ' + JSON.stringify(err));
        });*/
  };

  $scope.cancel = function () {
    $scope.modalInstance.dismiss('cancel');
  };

  $scope.updateCat = function () {
    var indexVal = $localStorage.indexVal;
    /*    SingleCat.update({
          newCatId: $scope.cat.catId
        }, $scope.cat, function (res) {
          $scope.categories.splice(indexVal, 1);
          $scope.categories.splice(indexVal, 0, res);
          delete $localStorage.indexVal;
          $scope.modalInstance.close();
        }, function (err) {
          //console.log('Error occured while Updating category, Error details are : ' + JSON.stringify(err));
        });*/


    Upload.upload({
      url: 'http://www.reciflix.com/newcats/' + $scope.cat.catId,
      file: $scope.cat.picFile,
      data: $scope.cat
    }).then(function (resp) {
      $scope.categories.splice(indexVal, 1);
      $scope.categories.splice(indexVal, 0, resp.data);
      delete $localStorage.indexVal;
      $scope.modalInstance.close();
      console.log('Success ' + resp.config.data.file.name + ', uploaded. Response: ' + JSON.stringify(resp.data));
      console.log('Success uploaded. Response: ' + JSON.stringify(resp));
    }, function (resp) {
      console.log('Error status: ' + resp.status);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });









  };

  $scope.deleteCat = function (cat) {
    var modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/del-cat-modal.html',
      scope: $scope,
      controller: 'DelCatCtrl'
    });

    modalInstance.result.then(function () {
      var indexVal = $localStorage.indexVal;
      SingleCat.delete({
        newCatId: cat.catId
      }, function (res) {
        $scope.categories.splice(indexVal, 1);
        delete $localStorage.indexVal;
        $scope.modalInstance.close();
      }, function (err) {
        //console.log('Error occured while deleteing category, Error details are : ' + JSON.stringify(err));
      });
      $scope.modalInstance.dismiss('cancel');
    }, function () {});
  };
}])

.controller('DelCatCtrl', ["$scope", "$modalInstance", function ($scope, $modalInstance) {
  $scope.deleteCatConfirm = function () {
    $modalInstance.close();
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}])

.controller('SubCatCtrl', ["$scope", "$stateParams", "SubCategories", "$modal", "SubCat", "$localStorage", function ($scope, $stateParams, SubCategories, $modal, SubCat, $localStorage) {
  $scope.subCatFun = function () {
    SubCategories.query({
      catId: $stateParams.catId,
      pageId: 999,
      activeFilter: 3
    }).$promise.then(function (res) {
      $scope.CatObjWithSubCats = res;
    }).catch(function (err) {
      //console.log('Error happened : ' + JSON.stringify(err));
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };

  $scope.openCreateSubCatModal = function () {
    $scope.subCat = '';
    $scope.modalName = "Create Sub-Category";
    $scope.modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/create-sub-cat-modal.html',
      scope: $scope,
      controller: 'SubCatCtrl'
    });
  };

  $scope.createSubCat = function () {
    SubCategories.save({
      catId: $stateParams.catId,
      pageId: 999,
      activeFilter: 3
    }, $scope.subCat, function (res) {
      $scope.CatObjWithSubCats.subCats.unshift(res);
      $scope.modalInstance.close();
    }, function (err) {
      //console.log('Error occured while SubCategories creating , Error details are : ' + JSON.stringify(err));
    });
  };
  $scope.cancel = function () {
    $scope.modalInstance.dismiss('cancel');
  };
  $scope.displaySubCat = function (subCat) {
    $scope.modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/view-sub-cat-modal.html',
      scope: $scope,
      controller: 'SubCatCtrl'
    });
    $scope.getSingleSubCat(subCat);
  }
  $scope.editSubCat = function (subCat, index) {
    $scope.modalName = "Update Sub-Category";
    $localStorage.indexVal = index;
    $scope.modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/create-sub-cat-modal.html',
      scope: $scope,
      controller: 'SubCatCtrl'
    });
    $scope.getSingleSubCat(subCat);
  };


  $scope.getSingleSubCat = function (subCat, index) {
    SubCat.get({
      subCatId: subCat._id
    }, function (res) {
      $scope.subCat = res;
    }, function (err) {
      //console.log('Error occured while fetching category, Error details are : ' + JSON.stringify(err));
    });
  };

  $scope.updateSubCat = function () {
    var indexVal = $localStorage.indexVal;
    SubCat.update({
      subCatId: $scope.subCat._id
    }, $scope.subCat, function (res) {
      $scope.CatObjWithSubCats.subCats.splice(indexVal, 1);
      $scope.CatObjWithSubCats.subCats.splice(indexVal, 0, res);
      delete $localStorage.indexVal;
      $scope.modalInstance.close();
    }, function (err) {
      //console.log('Error occured while updating sub category, Error details are : ' + JSON.stringify(err));
    });
  };
  $scope.deleteSubCat = function (subCat) {
    //console.log('Want to del sub cat details are :' + JSON.stringify(subCat));
    var modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/del-sub-cat-modal.html',
      scope: $scope,
      controller: 'DelSubCatCtrl'
    });

    modalInstance.result.then(function () {
      var indexVal = $localStorage.indexVal;
      SubCat.delete({
        subCatId: subCat._id
      }, function (res) {
        $scope.CatObjWithSubCats.subCats.splice(indexVal, 1);
        delete $localStorage.indexVal;
        $scope.modalInstance.close();
      }, function (err) {
        //console.log('Error occured while deleteing category, Error details are : ' + JSON.stringify(err));
      });
      $scope.modalInstance.dismiss('cancel');
    }, function () {});
  }
}])

.controller('DelSubCatCtrl', ["$scope", "$modalInstance", function ($scope, $modalInstance) {
  $scope.deleteSubCatConfirm = function () {
    $modalInstance.close();
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}])
'use strict';

// Recipes Edit controller
angular.module('categories').controller('RecipesUpdateCtrl', ["$scope", "$state", "$localStorage", "Recipe", "$rootScope", "Categories", "SubCategories", "SubCategoryRecipes", function ($scope, $state, $localStorage, Recipe, $rootScope, Categories, SubCategories, SubCategoryRecipes) {



  $scope.getAllCats = function () {
    Categories.query({
      pageId: 999,
      activeFilter: 1 // get only active cats
    }).$promise.then(function (res) {
      $scope.cats = res;
    }).catch(function (err) {
      //console.log('Error happened : ' + JSON.stringify(err));
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };



  $scope.getSubCats = function () {

    //console.log('Selected cat for sub cats : ' + JSON.stringify($scope.catSelected));

    SubCategories.query({
      catId: $scope.catSelected.catId,
      pageId: 999,
      activeFilter: 1 // get only active sub cats
    }).$promise.then(function (res) {
      //console.log('Successfullly fetched sub categories11111 :' + JSON.stringify(res))
      $scope.subCats = res.subCats;
    }).catch(function (err) {
      //console.log('Error happened : ' + JSON.stringify(err));
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };





  $scope.getSubCatRecipes = function (pageNum) {
    //console.log('Selected Sub cat for Recipes : ' + JSON.stringify($scope.subCatSelected));
    SubCategoryRecipes.query({
      subCatId: $scope.subCatSelected.subCatId,
      pageId: 999
    }).$promise.then(function (res) {
      //console.log('Successfullly fetched sub category Recipes :' + JSON.stringify(res))
      $scope.subCatRecipes = res;
      $scope.itemsPerPage = 1;
      $scope.currentPage = 1;
      $scope.maxSize = 5;
      $scope.$watch('currentPage + itemsPerPage', function () {
        $scope.faqSingle = '';
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
          end = begin + $scope.itemsPerPage;
        $scope.finalitems = $scope.subCatRecipes.slice(begin, end);
      });

    }).catch(function (err) {
      //console.log('Error happened : ' + JSON.stringify(err));
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });

  };

  $scope.pageChanged = function () {
    //console.log('Page changed console and current page is : ' + $scope.vm.currentPage);
    //$scope.getSubCatRecipes($scope.vm.currentPage);
    $scope.UpdateMsg = false;
  }

  $scope.updateRecipeItem = function (item) {

    item.submitted.by = $localStorage.user.displayName

    Recipe.update({
      vrecipeId: item.recipeId
    }, item, function () {
      //console.log('Successfully updated Recipe');
      $scope.UpdateMsg = true;
      //$state.go('faqs.dashboard', {});
    }, function (errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  }


  $scope.deleteRecipe = function (item) {

    console.log('Recipe bedore state update : ' + JSON.stringify(item));
    item.submitted.by = $localStorage.user.displayName;
    item.state = 1111;
    // console.log('Recipe after state update : ' + JSON.stringify(item));

    Recipe.update({
      vrecipeId: item.recipeId
    }, item, function (res) {
      console.log('Successfully updated Recipe' + JSON.stringify(res));
      $scope.UpdateMsg = true;
      //$state.go('faqs.dashboard', {});
    }, function (errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  }







}])

'use strict';

//Directive used to set metisMenu and minimalize button
angular.module('categories')
  /**
   * INSPINIA - Responsive Admin Theme
   * Copyright 2015 Webapplayers.com
   *
   */


/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
  return {
    link: function (scope, element) {
      var listener = function (event, toState, toParams, fromState, fromParams) {
        // Default title - load on Dashboard 1
        var title = 'ReciFlix';
        // Create your own title pattern
        if (toState.data && toState.data.pageTitle) title = 'ReciFlix ';
        // if (toState.data && toState.data.pageTitle) title = 'ReciFlix | ' + toState.data.pageTitle;
        $timeout(function () {
          element.text(title);
        });
      };
      $rootScope.$on('$stateChangeStart', listener);
    }
  }
}
pageTitle.$inject = ["$rootScope", "$timeout"];;

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element) {
      // Call the metsiMenu plugin and plug it to sidebar navigation
      $timeout(function () {
        element.metisMenu();
      });
    }
  };
}
sideNavigation.$inject = ["$timeout"];;

/**
 * iboxTools - Directive for iBox tools elements in right corner of ibox
 */
function iboxTools($timeout) {
  return {
    restrict: 'A',
    scope: true,
    templateUrl: 'modules/categories/views/common/ibox_tools.html',
    controller: ["$scope", "$element", function ($scope, $element) {
      // Function for collapse ibox
      $scope.showhide = function () {
          var ibox = $element.closest('div.ibox');
          var icon = $element.find('i:first');
          var content = ibox.find('div.ibox-content');
          content.slideToggle(200);
          // Toggle icon from up to down
          icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
          ibox.toggleClass('').toggleClass('border-bottom');
          $timeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
          }, 50);
        },
        // Function for close ibox
        $scope.closebox = function () {
          var ibox = $element.closest('div.ibox');
          ibox.remove();
        }
    }]
  };
}
iboxTools.$inject = ["$timeout"];;

/**
 * minimalizaSidebar - Directive for minimalize sidebar
 */
function minimalizaSidebar($timeout) {
  return {
    restrict: 'A',
    template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
    controller: ["$scope", "$element", function ($scope, $element) {
      $scope.minimalize = function () {
        $("body").toggleClass("mini-navbar");
        if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {

          // Hide menu in order to smoothly turn on when maximize menu
          $('#side-menu').hide();
          // For smoothly turn on menu
          setTimeout(
            function () {
              $('#side-menu').fadeIn(500);
            }, 100);
        } else if ($('body').hasClass('fixed-sidebar')) {

          $('#side-menu').hide();
          setTimeout(
            function () {
              $('#side-menu').fadeIn(500);
            }, 300);
        } else {
          // Remove all inline style from jquery fadeIn function to reset menu state
          $('#side-menu').removeAttr('style');
        }
      }
    }]
  };
}
minimalizaSidebar.$inject = ["$timeout"];;



/**
 *
 * Pass all functions into module
 */
angular
  .module('categories')
  .directive('pageTitle', pageTitle)
  .directive('sideNavigation', sideNavigation)
  .directive('iboxTools', iboxTools)
  .directive('minimalizaSidebar', minimalizaSidebar)

'use strict';

//Categories service used for communicating with the categories REST endpoints
angular.module('categories')

//.constant('API_HOST', 'http://192.168.1.248:3000')
//.constant('API_HOST', 'http://localhost:3000')
.constant('API_HOST', 'http://www.reciflix.com')


.factory('Categories', ["$resource", "API_HOST", function ($resource, API_HOST) {
    return $resource(API_HOST + '/newcats/page/:pageId/:activeFilter', {
      pageId: '@pageId',
      activeFilter: '@activeFilter'
    }, {
      'query': {
        method: 'GET',
        isArray: true,
        timeout: 20000
      }
    });
  }])
  .factory('SingleCat', ["$resource", "API_HOST", function ($resource, API_HOST) {
    return $resource(API_HOST + '/newcats/:newCatId', {
      newCatId: '@newCatId'
    }, {
      'save': {
        method: 'POST'
      },
      'get': {
        method: 'GET'
      },
      'update': {
        method: 'PUT'
      },
      'delete': {
        method: 'DELETE'
      }
    });
  }])

.factory('SubCategories', ["$resource", "API_HOST", function ($resource, API_HOST) {
  return $resource(API_HOST + '/subCats/:catId/:pageId/:activeFilter', {
    catId: '@catId',
    pageId: '@pageId',
    activeFilter: '@activeFilter'
  }, {
    'query': {
      method: 'GET',
      timeout: 20000
    },
    'save': {
      method: 'POST'
    }
  });
}])


.factory('SubCat', ["$resource", "API_HOST", function ($resource, API_HOST) {
  return $resource(API_HOST + '/singleSubCat/:subCatId', {
    subCatId: '@subCatId'
  }, {
    'update': {
      method: 'PUT'
    },
    'get': {
      method: 'GET'
    },
    'delete': {
      method: 'DELETE'
    }
  });
}])

.factory('NotificationFactory', function () {
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "onclick": null,
    "showDuration": "400",
    "hideDuration": "1000",
    "timeOut": "7000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }
  return {
    success: function (msg, title) {
      toastr.success(msg, title);
    },
    error: function (msg, title) {
      toastr.error(msg, title);
    }
  };
})

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
 function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('');

    // Home state routing
    $stateProvider.
    state('home', {
        url: '',
        templateUrl: 'modules/core/views/home.client.view.html',
        module: 'public',
        data: {
          bodyClass: 'bg-body'
        }
      })
      .state('terms', {
        url: '/terms',
        templateUrl: 'modules/core/views/terms.client.view.html',
        module: 'public'
      })
      .state('privacy', {
        url: '/privacy',
        templateUrl: 'modules/core/views/privacy.client.view.html',
        module: 'public'
      });
 }
]).run(["$rootScope", "$state", "$stateParams", function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
}]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$http', '$location', '$localStorage',
 function ($scope, Authentication, Menus, $http, $location, $localStorage) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');

    $scope.toggleCollapsibleMenu = function () {
      console.log('Checking toggleCollapsibleMenu ');
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

 }
]);

'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$state', 'ProspectiveEmail',
 function ($scope, Authentication, $state, ProspectiveEmail) {

    $scope.authentication = Authentication;

    if (navigator.userAgent.match(/Android/i)) {
      //console.log('Android user came');
      //alert('Android user came');
      $scope.androidUser = true;
    } else if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
      $scope.iosUser = true;
    }
 }]);

/**
 * INSPINIA - Responsive Admin Theme
 * Copyright 2014 Webapplayers.com
 *
 * Custom scripts
 */

$(document).ready(function () {

    fix_height();

});

// Full height of sidebar
function fix_height() {
    var heightWithoutNavbar = $("body > #wrapper").height() - 61;
    $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");
    var windowHeight = $( window ).height();
    $("#page-wrapper").css("min-height", windowHeight + "px");
};

$(window).bind("load resize click scroll", function() {
    if(!$("body").hasClass('body-small')) {
        fix_height();
    }
});

// Minimalize menu when screen is less than 768px
$(window).bind("load resize", function() {
    if ($(this).width() < 769) {
        $('body').addClass('body-small')
    } else {
        $('body').removeClass('body-small')
    }
});


'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

 function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || ('/' + menuItemURL),
        isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
        roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || ('/' + menuItemURL),
            isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
            roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar');
 }
]);

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('core').factory('ProspectiveEmail', ['$resource',
 function ($resource) {
    return {
      emailPost: $resource('/ProspectiveEmails', {}, {
        'save': {
          method: 'POST'
        }
      }),


      emailGet: $resource('/ProspectiveEmails/count/:platform', {
        platform: '@platform'
      }, {
        'query': {
          method: 'GET'
        }
      })

    };
  }

]);

'use strict';

/*// Configuring the Articles module
angular.module('articles').run(['Menus',
 function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
    Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
    Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
 }
]);*/

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

'use strict';

// Recipes controller
angular.module('recipes').controller('RecipesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Vrecipes', '$localStorage', '$http',
 function ($scope, $stateParams, $location, Authentication, Vrecipes, $localStorage, $http) {
    $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;
    $scope.authentication = Authentication;
    $scope.categories = function () {
      Vrecipes.getcategory.query({}, function (res) {
        $scope.categories = res;
      });
    };

    $scope.createcategories = function () {
      $scope.newcat = function () {
        var categorie = {
          'catId': this.categorie.catId,
          'displayName': this.categorie.displayName,
          'imageName': this.categorie.imageName,

        };
        Vrecipes.savecategory.save(categorie, function (result) {
          $scope.categorie = '';
        });
      };
    };

    $scope.availableTags = ['Chicken', 'Mutton', 'Veg', 'Non-veg', 'Curry', 'Gravy', 'Salads', 'Desserts', 'Cake', 'Sweets', 'Snacks', 'Appetizers', 'Breads', 'Dipping Sides', 'Kids', 'Festival', 'Diwali', 'Ganesh Festival', 'Sankranthi', 'Rakhi', 'Dushera', 'Healthy', 'Indo chineese', 'South Indian Recipes', 'Soup', 'Chutney', 'Indian Pickels', 'Pregnancy Diet', 'Egg Less', 'SandWhich', 'Fruit', 'Special', 'Hot Drinks', 'Soft Drinks', 'Lunch', 'Break Fast', 'Pasta', 'Ice-Creams', 'Chat', 'Pickle', 'North-Indian', 'Spreads', 'Rice', 'Cashews Special', 'Paratha', 'Chineese', 'Rajasthani', 'Naan', 'Roti', 'Milk', 'Biriyani', 'Pulao', 'Cookies', 'Kitchen Requirements', 'Mushroom', 'Pizza', 'Bakery', 'Chocolates'];


    $scope.availableCats = ['Chicken', 'Mutton', 'Veg', 'nonveg', 'Curry', 'Gravy', 'Salads', 'Desserts', 'Cake', 'Sweets', 'Snacks', 'Appetizers', 'Breads', 'Dipping Sides', 'Kids', 'Festival', 'Diwali', 'Ganesh Festival', 'Sankranthi', 'Rakhi', 'Dushera', 'Healthy', 'Indo chineese', 'South Indian Recipes', 'Soup', 'Chutney', 'Indian Pickels', 'Pregnancy Diet', 'Egg Less', 'SandWhich', 'Fruit', 'Special', 'Hot Drinks', 'Soft Drinks', 'Lunch', 'Break Fast', 'Pasta', 'Ice-Creams', 'Chat', 'Pickle', 'North-Indian', 'Spreads', 'Rice', 'Cashews Special', 'Paratha', 'Chineese', 'Rajasthani', 'Naan', 'Roti', 'Milk', 'Biriyani', 'Pulao', 'Cookies', 'Kitchen Requirements', 'Mushroom', 'Pizza', 'Bakery', 'Chocolates'];



    $scope.selected = function () {

      //console.log('selected item' + this.categoriesname);

      Vrecipes.getrecipes.query({
        CategoryName: this.categoriesname
      }, function (res) {
        $scope.recipes = res;
        $scope.totalItems = $scope.recipes.length;
        $scope.itemsPerPage = 1;
        $scope.currentPage = 1;
        $scope.maxSize = 5;
        $scope.pageCount = function () {
          return Math.ceil($scope.recipes.length / $scope.itemsPerPage);
        };
        $scope.$watch('currentPage + itemsPerPage', function () {
          var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
            end = begin + $scope.itemsPerPage;
          $scope.filteredrecipe = $scope.recipes.slice(begin, end);
        });
      });
    };

    $scope.updaterecipes = function (recipe) {
      var updatedRecipe = recipe;
      updatedRecipe.submitted.by = 'reciflix_admin';
      updatedRecipe.state = 123;
      Vrecipes.updaterecipes.update({
        vrecipeId: updatedRecipe._id
      }, updatedRecipe, function (result) {}, function (err) {
        //console.log('Update recipe error : ' + JSON.stringify(err));
      });
    };

    $scope.removeRecipes = function (recipe) {
      //console.log('inside removeRecipes');
      var updatedRecipe = recipe;
      updatedRecipe.submitted.by = 'reciflix_admin';
      updatedRecipe.state = 333;
      Vrecipes.updaterecipes.update({
        vrecipeId: updatedRecipe._id
      }, updatedRecipe, function (result) {
        //console.log('Remove Recipe details Successfully   ' + JSON.stringify(result));
      }, function (err) {
        //console.log('Update recipe error : ' + JSON.stringify(err));
      });
    };
}])

.controller('RecipesCtrl', ["$scope", "$localStorage", "$state", "Categories", "$modal", "SingleCat", "NotificationFactory", "UserSuggestion", function ($scope, $localStorage, $state, Categories, $modal, SingleCat, NotificationFactory, UserSuggestion) {
  $scope.categoryFun = function () {
    Categories.query({
      pageId: 999,
      activeFilter: 1 // get only active cats
    }).$promise.then(function (res) {
      $scope.categories = res;
    }).catch(function (err) {
      //console.log('Error happened : ' + JSON.stringify(err));
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };

  $scope.minimalize = function () {
    $("body").addClass("mini-navbar");
    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {

      // Hide menu in order to smoothly turn on when maximize menu
      $('#side-menu').hide();
      // For smoothly turn on menu
      setTimeout(
        function () {
          $('#side-menu').fadeIn(500);
        }, 100);
    } else if ($('body').hasClass('fixed-sidebar')) {

      $('#side-menu').hide();
      setTimeout(
        function () {
          $('#side-menu').fadeIn(500);
        }, 300);
    } else {
      // Remove all inline style from jquery fadeIn function to reset menu state
      $('#side-menu').removeAttr('style');
    }
  }



  $scope.OpenCreateSuggest = function () {
    //console.log('Successfullly fetched Open Model');

    $scope.modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/create-suggestion-modal.html',
      controller: 'RecipesCtrl',
      scope: $scope
    });
  };

  $scope.cancel = function () {
    $scope.modalInstance.dismiss('cancel');
  };


  $scope.createSuggest = function () {
    UserSuggestion.save({
      pageId: 0
    }, $scope.suggest, function (res) {
      //$scope.categories.push(res);
      $scope.modalInstance.close();
      //console.log('Successfullly Saved suggestion ' + JSON.stringify(res));
    }, function (err) {
      console.log('Error occured while creating suggestion, Error details are : ' + JSON.stringify(err));
    });
  };








}])


.controller('SubCategoriesCtrl', ["$scope", "$stateParams", "SubCategories", "$modal", "$localStorage", function ($scope, $stateParams, SubCategories, $modal, $localStorage) {
  //$scope.catName = $stateParams.catName;
  $scope.catId = $stateParams.catId;
  //$scope.SubCatName = $stateParams.SubCatName;
  $scope.subCatFun = function () {
    SubCategories.query({
      catId: $stateParams.catId,
      pageId: 999,
      activeFilter: 1 // get only active sub cats
    }).$promise.then(function (res) {
      //console.log('Successfullly fetched sub categories11111 :' + JSON.stringify(res))
      $scope.CatObjWithSubCats = res;
    }).catch(function (err) {
      //console.log('Error happened : ' + JSON.stringify(err));
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };
}])

.controller('SubCatRecipesCtrl', ["$scope", "$stateParams", "SubCategoryRecipes", "$rootScope", "Recipe", "$sce", function ($scope, $stateParams, SubCategoryRecipes, $rootScope, Recipe, $sce) {
  $scope.catId = $stateParams.catId;
  $scope.subCatId = $stateParams.subCatId;
  //$scope.SubCatName = $stateParams.SubCatName;
  $scope.totalItems = 500;
  $scope.vm = {
    currentPage: 1
  };
  $scope.itemsPerPage = 5;
  $scope.maxSize = 5;
  $scope.recipesUnderSubCat = function (pageNum) {
    SubCategoryRecipes.query({
      subCatId: $stateParams.subCatId,
      pageId: (pageNum - 1)
    }).$promise.then(function (res) {
      //console.log('Successfullly fetched sub category Recipes :' + JSON.stringify(res))
      $scope.subCatRecipes = res;
    }).catch(function (err) {
      //console.log('Error happened : ' + JSON.stringify(err));
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };

  $scope.pageChanged = function () {
    //console.log('Page changed console and current page is : ' + $scope.vm.currentPage);
    $scope.recipesUnderSubCat($scope.vm.currentPage);
  }


  $scope.getSingleRecipe = function () {
    Recipe.get({
      vrecipeId: $stateParams.recipeId
    }).$promise.then(function (res) {
      // console.log('Successfullly fetched Recipe :' + JSON.stringify(res))
      $scope.recipe = res;
      $scope.youTubeRecipeURL = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + res.videoId + "?rel=0&amp;controls=1&amp;showinfo=0");

      //https://www.youtube.com/embed/iJUdcbCoIcA?rel=0&amp;controls=1&amp;showinfo=0
    }).catch(function (err) {
      //console.log('Error happened : ' + JSON.stringify(err));
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };
}]);

angular.module('recipes').directive('myYoutube', ["$sce", function ($sce) {
  return {
    restrict: 'EA',
    scope: {
      code: '='
    },
    replace: true,
    template: '<div style="height:350px; width:100%"><iframe style="overflow:hidden;height:100%;width:70%" controls="0" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
    link: function (scope) {
      //console.log('here');
      scope.$watch('code', function (newVal) {
        if (newVal) {
          scope.url = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + newVal);
        }
      });
    }
  };
}]);

'use strict';

// Recipes Filter
angular.module('recipes')

.filter('numeral', function () {
  return function (count) {
    var numericalFormat = numeral(count).format('0.0a');
    return numericalFormat;
  };
})

.filter('durationFltr', function () {
  return function (millis) {
    var durationTxt = '1h:30m:20s';
    var secNum = Math.floor(millis / 60);
    var secTxt = millis % 60;
    var minNum = Math.floor(secNum / 60);
    var minTxt = secNum % 60;
    var hourNum = Math.floor(minNum / 60);
    var hourTxt = minNum;
    if (hourTxt == 0) {
      durationTxt = minTxt + 'm:' + secTxt + 's';
    } else
      durationTxt = hourTxt + 'h:' + minTxt + 'm:' + secTxt + 's';
    return durationTxt;
  };
});

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('recipes')

//.constant('API_HOST', 'http://192.168.1.248:3000')
//.constant('API_HOST', 'http://localhost:3000')
//.constant('API_HOST', 'http://www.reciflix.com')


.factory('Vrecipes', ['$resource',
 function ($resource) {

    return {

      getrecipes: $resource('/VRecipesByCategoriesForAdmin/:CategoryName', {
        CategoryName: '@CategoryName'
      }, {
        'query': {
          method: 'GET',
          isArray: true
        }
      }),


      updaterecipes: $resource('/vrecipes/:vrecipeId', {
        vrecipeId: '@vrecipeId'
      }, {
        'update': {
          method: 'PUT'
        }
      }),


      getcategory: $resource('/categories/admincats', {}, {
        'query': {
          method: 'GET',
          isArray: true
        }
      }),

      savecategory: $resource('/newcategories', {}, {
        'save': {
          method: 'POST'
        },
      }),

    };


 }
])

.factory('SubCategoryRecipes', ["$resource", "API_HOST", function ($resource, API_HOST) {
  return $resource(API_HOST + '/newrecipes/:subCatId/:pageId', {
    subCatId: '@subCatId',
    pageId: '@pageId'
  }, {
    'query': {
      method: 'GET',
      isArray: true,
      timeout: 20000
    }
  });
}])


.factory('Recipe', ["$resource", "API_HOST", function ($resource, API_HOST) {
  return $resource(API_HOST + '/nVRecipes/:vrecipeId', {
    vrecipeId: '@vrecipeId'
  }, {
    'get': {
      method: 'GET',
      timeout: 20000
    },
    'save': {
      method: 'POST'
    },
    'update': {
      method: 'PUT'
    },
    'query': {
      method: 'GET',
      isArray: true
    },
    'remove': {
      method: 'DELETE'
    },
    'delete': {
      method: 'DELETE'
    }
  });
}])







.factory('UserSuggestion', ["$resource", "API_HOST", function ($resource, API_HOST) {
  return $resource(API_HOST + '/users/suggestions/:pageId', {
    pageId: '@pageId'
  }, {
    'get': {
      method: 'GET'
    },
    'save': {
      method: 'POST'
    },
    'update': {
      method: 'PUT'
    },
    'query': {
      method: 'GET',
      isArray: true
    },
    'remove': {
      method: 'DELETE'
    },
    'delete': {
      method: 'DELETE'
    }
  });
}]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
 function ($stateProvider) {
    // Users state routing
    $stateProvider.
    state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).
    state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).
    state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).
    state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).
    state('signin', {
      url: '/login',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html',
      module: 'public',
      data: {
        bodyClass: 'bg-body'
      }
    }).
    state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html',
      module: 'public',
      data: {
        bodyClass: 'bg-body'
      }
    }).
    state('reset-invalid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).
    state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).
    state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    })





    .state('reciflix.users', {
      url: "users",
      templateUrl: "modules/users/views/users.html",
      controller: 'UsersCtrl',
      module: 'private'
    });
 }
]).run(["$rootScope", "$state", "$stateParams", function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
}]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', '$localStorage', 'Users', '$state',
 function ($scope, $http, $location, Authentication, $localStorage, Users, $state) {
    $scope.authentication = Authentication;
    // If user is signed in then redirect back home
    //if ($scope.authentication.user) $location.path('/');

    $scope.signup = function () {
      $http.post('/users/signup', $scope.credentials).success(function (response) {
        //console.log('signup client side response ' + JSON.stringify(response));
        if (response.type === false) {
          $scope.error = response.data;
        } else {
          $scope.authentication.user = response;
          $localStorage.token = response.token;
          $location.path('/welcomePage');
        }
      });
    };
    if (navigator.userAgent.match(/Android/i)) {
      //console.log('Android user came');
      //alert('Android user came');
      $scope.androidUser = true;
    } else if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
      $scope.iosUser = true;
    }
    $scope.Login = function () {
      $scope.loading = true;
      //console.log('Login Function is Triggred: ' + JSON.stringify($scope.credentials));
      Users.Login.create($scope.credentials).$promise.then(function (res) {
        //console.log('Res after login : ' + JSON.stringify(res));
        if (res.type === false) {
          $scope.errMsg = res.data;
          $scope.loading = false;
        } else {
          $scope.errMsg = false;
          //console.log('User details after login: ' + JSON.stringify(res));
          $localStorage.user = res;
          $localStorage.token = res.token;
          $state.go('reciflix.recipes');
          $scope.loading = false;
        }
      }).catch(function (err) {
        //console.log('Error happened: ' + JSON.stringify(err));
        //console.log('Looks like there is an issue with your connectivity, Please try after sometime!');
      });
    };


}]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', '$localStorage',

 function ($scope, $stateParams, $http, $location, Authentication, $localStorage) {
    $scope.authentication = Authentication;

    //If user is signed in then redirect back home
    if ($scope.authentication.user) $location.path('/');

    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;

      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;

      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        console.log('Password reset conformation :' + JSON.stringify(response));
        // Attach user profile
        Authentication.user = response;
        $localStorage.token = response.token;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
 }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users')

.controller('UsersCtrl', ['$scope', '$state', 'Users', '$rootScope', function ($scope, $state, Users, $rootScope, $localStorage) {

  var usageCount = 'UC';
  var totalUsersCount = 'TUC';
  var userSuggestions = 'US';


  $scope.getAllUsers = function (pageNum) {
    Users.AllUsers.query({
      pageId: (pageNum - 1) + totalUsersCount
    }).$promise.then(function (res) {
      $scope.users = res.users;
      $scope.itemsPerPage = 5;
      $scope.maxSize = 5;
      $scope.totalItems = res.count;
      if (totalUsersCount === 'TUC')
        totalUsersCount = totalUsersCount + res.count;
      if ($rootScope.pageNumStore > 1) {
        $scope.vm.currentPage = $rootScope.pageNumStore;
        $rootScope.pageNumStore = 1;
      } else {
        $scope.vm = {
          currentPage: 1
        };
      }
    }).catch(function (err) {});
  };


  $scope.getUsageDetails = function (pageNum) {
    Users.UsageDetails.query({
      pageId: (pageNum - 1) + usageCount
    }).$promise.then(function (res) {
      $scope.usageDetails = res.details;
      $scope.totalItems1 = res.count;
      if (usageCount === 'UC')
        usageCount = usageCount + res.count;
      $scope.itemsPerPage1 = 5;
      $scope.maxSize1 = 5;
      if ($rootScope.pageNumStore1 > 1) {
        $scope.vm.currentPage1 = $rootScope.pageNumStore1;
        $rootScope.pageNumStore1 = 1;
      } else {
        $scope.vm = {
          currentPage1: 1
        };
      }
    }).catch(function (err) {
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };

  $scope.pageChanged1 = function () {
    if ($scope.vm.currentPage1 === 1) {
      $scope.getUsageDetails($scope.vm.currentPage1);
    } else {
      $rootScope.pageNumStore1 = $scope.vm.currentPage1;
      $scope.getUsageDetails($scope.vm.currentPage1);
    }
  }

  $scope.pageChanged = function () {
    if ($scope.vm.currentPage === 1) {
      $scope.getAllUsers($scope.vm.currentPage);
    } else {
      $rootScope.pageNumStore = $scope.vm.currentPage;
      $scope.getAllUsers($scope.vm.currentPage);
    }
  };




  $scope.getUsersSuggestions = function (pageNum) {
    Users.UsersSuggestion.query({
      pageId: (pageNum - 1) + userSuggestions
    }).$promise.then(function (res) {
      $scope.suggestions = res.suggestions;
      $scope.totalItems2 = res.count;
      if (userSuggestions === 'US')
        userSuggestions = userSuggestions + res.count;
      $scope.itemsPerPage2 = 5;
      $scope.maxSize2 = 5;
      if ($rootScope.pageNumStore2 > 1) {
        $scope.vm.currentPage2 = $rootScope.pageNumStore2;
        $rootScope.pageNumStore2 = 1;
      } else {
        $scope.vm = {
          currentPage2: 1
        };
      }
    }).catch(function (err) {
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });

  };

  $scope.pageChanged2 = function () {
    if ($scope.vm.currentPage2 === 1) {
      $scope.getUsersSuggestions($scope.vm.currentPage2);
    } else {
      $rootScope.pageNumStore2 = $scope.vm.currentPage2;
      $scope.getUsersSuggestions($scope.vm.currentPage2);
    }
  }
}])

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window', function($window) {
	var auth = {
		user: $window.user
	};
	
	return auth;
}]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
 function ($resource) {
    return $resource('users', {}, {
      update: {
        method: 'PUT'
      }
    });
 }
])

//API_HOST is taken from single spot category.client.services.js
//.constant('API_HOST', 'http://localhost:3000')
//.constant('API_HOST', 'http://www.reciflix.com')

.factory('Users', ['$resource', 'API_HOST', function ($resource, API_HOST, $localStorage) {
  return {
    Signup: $resource(API_HOST + '/users/signup', {}, {
      create: {
        method: 'POST',
        timeout: 30000
      }
    }),
    Login: $resource(API_HOST + '/users/signin', {}, {
      create: {
        method: 'POST',
        timeout: 20000
      }
    }),
    AllUsers: $resource(API_HOST + '/users/totalUsers/:pageId', {
      pageId: '@pageId'
    }, {
      query: {
        method: 'GET',
        timeout: 20000
      }
    }),
    UsageDetails: $resource(API_HOST + '/users/usage-details-collection/:pageId', {
      pageId: '@pageId'
    }, {
      query: {
        method: 'GET',
        timeout: 20000
      }
    }),
    UsersSuggestion: $resource(API_HOST + '/users/suggestions/:pageId', {
      pageId: '@pageId'
    }, {
      query: {
        method: 'GET',
        timeout: 20000
      }
    })
  }
}]);
