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
angular.module('categories').controller('ReciflixCtrl', ['$scope', '$state', '$localStorage', '$location', '$http', 'Authentication', '$modal', function ($scope, $state, $localStorage, $location, $http, Authentication, $modal) {
  $scope.authentication = Authentication;
  $scope.authentication.user = $localStorage.user;

  $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;
  $scope.goToSearchRecipes = function (params) {
    $state.go('reciflix.recipes.searchedrecipes', {
      query: params
    })
  }


  //console.log('getLocalUser is called')
  var currentUser = $localStorage.user;
  var userDisplayName = '';
  if (currentUser) {
    userDisplayName = $localStorage.user.displayName;
  }
  $scope.userName = userDisplayName;
  $scope.localUser = $localStorage.user;



  $scope.signout = function () {
    $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;
    $http.post('/users/signout').success(function (response) {
      //console.log('Signout callback : ' + JSON.stringify(response));
      $scope.authentication.user = '';
      delete $localStorage.token;
      delete $localStorage.user;
      $state.go('reciflix.recipes');
    });
  };
  $scope.minimalize = function () {
    if ($('body').hasClass('body-small')) {
      $("body").removeClass("mini-navbar");
    } else {
      $("body").addClass("mini-navbar");
      $("body").addClass('fixed-sidebar');
      $('.sidebar-collapse').slimScroll({
        height: '100%',
        railOpacity: 0.9,
      });
    }
  }

  $scope.OpenSignIn = function () {
    $scope.signFun = true;
    //console.log('Sign In function is called');
    $scope.modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/signIn-modal.html',
      controller: 'AuthenticationController',
      backdrop: "static",
      scope: $scope
    });
  }

  $scope.cancel = function () {
    $scope.modalInstance.dismiss('cancel');
  };


}])

.controller('CategoryCtrl', ["$scope", "$localStorage", "$state", "Categories", "$modal", "SingleCat", "NotificationFactory", "Upload", "$timeout", "ConfigService", function ($scope, $localStorage, $state, Categories, $modal, SingleCat, NotificationFactory, Upload, $timeout, ConfigService) {
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
    $scope.catName = '';
    $scope.modalName = "Create Category";
    $scope.modalBtnName = "Create Category";
    $scope.modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/create-cat-modal.html',
      controller: 'CategoryCtrl',
      backdrop: "static",
      scope: $scope
    });
  };

  $scope.editCat = function (cat, index) {
    $scope.modalName = "Update Category";
    $scope.modalBtnName = "Update Category";
    $scope.updatingLogo = true;
    $localStorage.indexVal = index;

    $scope.modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/create-cat-modal.html',
      backdrop: "static",
      scope: $scope,
      controller: 'CategoryCtrl'
    });
    $scope.getCatDetails(cat);
  };

  $scope.displayCat = function (cat) {
    $scope.modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/view-cat-modal.html',
      backdrop: "static",
      scope: $scope,
      controller: 'CategoryCtrl'
    });
    $scope.getCatDetails(cat);
  }

  $scope.getCatDetails = function (cat) {
    SingleCat.get({
      newCatId: cat.catId
    }, function (res) {
      $scope.updatingLogo = false;
      $scope.cat = res;
      $scope.catName = res.displayName;
    }, function (err) {
      //console.log('Error occured while fetching category, Error details are : ' + JSON.stringify(err));
    });
  };

  $scope.setFile = function (element) {
    $scope.$apply(function ($scope) {
      $scope.theFile = element.files[0];
      //console.log('Successfully fetched the image file ' + JSON.stringify($scope.theFile));
    });
  };

  $scope.createCat = function () {
    //console.log('Successfully fetched the image file ' + JSON.stringify($scope.cat));
    //$scope.updatingLogo = true;
    $scope.isDisabled = true;
    $scope.modalBtnName = "Creating...";
    Upload.upload({
      url: ConfigService.API_URL + '/newcats',
      file: $scope.cat.picFile,
      data: $scope.cat
    }).then(function (resp) {
      $scope.categories.unshift(resp.data);
      //$scope.updatingLogo = false;
      $scope.modalInstance.close();
      //console.log('Success ' + resp.config.data.file.name + ', uploaded. Response: ' + JSON.stringify(resp.data));
      //console.log('Success uploaded. Response: ' + JSON.stringify(resp));
    }, function (resp) {
      console.log('Error status: ' + resp.status);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
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
    $scope.modalBtnName = "Updating...";
    $scope.isDisabled = true;
    //$scope.updatingLogo = true;
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
      url: ConfigService.API_URL + '/newcats/' + $scope.cat.catId,
      file: $scope.cat.picFile,
      data: $scope.cat
    }).then(function (resp) {
      $scope.categories.splice(indexVal, 1);
      $scope.categories.splice(indexVal, 0, resp.data);
      delete $localStorage.indexVal;
      //$scope.updatingLogo = false;
      $scope.modalInstance.close();
      //console.log('Success ' + resp.config.data.file.name + ', uploaded. Response: ' + JSON.stringify(resp.data));
      //console.log('Success uploaded. Response: ' + JSON.stringify(resp));
      if (resp.config.data.file) {
        //console.log('Checking response when file on callback');
        $timeout(function () {
          $state.go($state.current, {}, {
            reload: true
          });
        }, 2000);
      }
    }, function (resp) {
      console.log('Error status: ' + resp.status);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });
  };

  $scope.deleteCat = function (cat) {
    var modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/del-cat-modal.html',
      backdrop: "static",
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

.controller('SubCatCtrl', ["$scope", "$stateParams", "SubCategories", "$modal", "SubCat", "$localStorage", "Upload", "$timeout", "$state", "ConfigService", function ($scope, $stateParams, SubCategories, $modal, SubCat, $localStorage, Upload, $timeout, $state, ConfigService) {
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
    $scope.catName = '';
    $scope.subCat = '';
    $scope.modalName = "Create Sub-Category";
    $scope.modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/create-sub-cat-modal.html',
      backdrop: "static",
      scope: $scope,
      controller: 'SubCatCtrl'
    });
  };

  $scope.createSubCat = function () {
    $scope.updatingLogo = true;
    Upload.upload({
      url: ConfigService.API_URL + '/subCats/' + $stateParams.catId + '/999/3',
      file: $scope.subCat.picFile,
      data: $scope.subCat
    }).then(function (resp) {
      $scope.CatObjWithSubCats.subCats.unshift(resp.data);
      $scope.updatingLogo = false;
      $scope.modalInstance.close();
      //console.log('Success ' + resp.config.data.file.name + ', uploaded. Response: ' + JSON.stringify(resp.data));
      //console.log('Success uploaded. Response: ' + JSON.stringify(resp));
    }, function (resp) {
      console.log('Error status: ' + resp.status);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });

    /*SubCategories.save({
      catId: $stateParams.catId,
      pageId: 999,
      activeFilter: 3
    }, $scope.subCat, function (res) {
      $scope.CatObjWithSubCats.subCats.unshift(res);
      $scope.modalInstance.close();
    }, function (err) {
      //console.log('Error occured while SubCategories creating , Error details are : ' + JSON.stringify(err));
    });*/
  };
  $scope.cancel = function () {
    $scope.modalInstance.dismiss('cancel');
  };
  $scope.displaySubCat = function (subCat) {
    $scope.modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/view-sub-cat-modal.html',
      backdrop: "static",
      scope: $scope,
      controller: 'SubCatCtrl'
    });
    $scope.getSingleSubCat(subCat);
  }
  $scope.editSubCat = function (subCat, index) {
    $scope.modalName = "Update Sub-Category";
    $scope.updatingLogo = true;
    $scope.subCatName = subCat.displayName;
    $localStorage.indexVal = index;
    $scope.modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/create-sub-cat-modal.html',
      backdrop: "static",
      scope: $scope,
      controller: 'SubCatCtrl'
    });
    $scope.getSingleSubCat(subCat);
  };


  $scope.getSingleSubCat = function (subCat, index) {
    SubCat.get({
      subCatId: subCat.subCatId
    }, function (res) {
      $scope.updatingLogo = false;
      $scope.subCat = res;
    }, function (err) {
      //console.log('Error occured while fetching category, Error details are : ' + JSON.stringify(err));
    });
  };

  $scope.updateSubCat = function () {
    $scope.updatingLogo = true;
    var indexVal = $localStorage.indexVal;
    Upload.upload({
      url: ConfigService.API_URL + '/singleSubCat/' + $scope.subCat.subCatId,
      file: $scope.subCat.picFile,
      data: $scope.subCat
    }).then(function (resp) {
      $scope.CatObjWithSubCats.subCats.splice(indexVal, 1);
      $scope.CatObjWithSubCats.subCats.splice(indexVal, 0, resp.data);
      delete $localStorage.indexVal;
      $scope.updatingLogo = false;
      $scope.modalInstance.close();
      //console.log('Success ' + resp.config.data.file.name + ', uploaded. Response: ' + JSON.stringify(resp.data));
      //console.log('Success uploaded. Response: ' + JSON.stringify(resp));
      if (resp.config.data.file) {
        //console.log('Checking response when file on callback');
        $timeout(function () {
          $state.go($state.current, {}, {
            reload: true
          });
        }, 2000);
      }
    }, function (resp) {
      console.log('Error status: ' + resp.status);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });



    /*SubCat.update({
      subCatId: $scope.subCat._id
    }, $scope.subCat, function (res) {
      $scope.CatObjWithSubCats.subCats.splice(indexVal, 1);
      $scope.CatObjWithSubCats.subCats.splice(indexVal, 0, res);
      delete $localStorage.indexVal;
      $scope.modalInstance.close();
    }, function (err) {
      //console.log('Error occured while updating sub category, Error details are : ' + JSON.stringify(err));
    });*/
  };
  $scope.deleteSubCat = function (subCat) {
    //console.log('Want to del sub cat details are :' + JSON.stringify(subCat));
    var modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/del-sub-cat-modal.html',
      backdrop: "static",
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
    $scope.loading = true;
    // console.log('Selected Sub cat for Recipes : ' + JSON.stringify($scope.subCatSelected));
    SubCategoryRecipes.query({
      subCatId: $scope.subCatSelected.subCatId,
      pageId: 999
    }).$promise.then(function (res) {
      //console.log('Successfullly fetched sub category Recipes in recipe update function :' + JSON.stringify(res))
      $scope.subCatRecipes = res.recipes;
      $scope.loading = false;
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

    //console.log('Recipe bedore state update : ' + JSON.stringify(item));
    item.submitted.by = $localStorage.user.displayName;
    item.state = 1111;
    // console.log('Recipe after state update : ' + JSON.stringify(item));

    Recipe.update({
      vrecipeId: item.recipeId
    }, item, function (res) {
      //console.log('Successfully updated Recipe' + JSON.stringify(res));
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
        if (!$('body').hasClass('mini-navbar')) {
          $('#side-menu').hide();
          // For smoothly turn on menu
          setTimeout(
            function () {
              $('#side-menu').fadeIn(500);
            }, 100);
        } else if ($('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
          $("body").addClass('fixed-sidebar');
          $('.sidebar-collapse').slimScroll({
            height: '100%',
            railOpacity: 0.9,
          });
          $('#side-menu').hide();
          setTimeout(
            function () {
              $('#side-menu').fadeIn(900);
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

        /*$("body").toggleClass("mini-navbar");
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
        }*/
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


/*provides environment specific API url */
.service('ConfigService', ["$window", function ($window) {
  if ($window.location.host.match(/reciflix\.com/)) {
    //console.log('its prod: ' + $window.location.host);
    this.API_URL = 'http://www.reciflix.com';
    return this.API_URL;
  } else if ($window.location.host.match(/202.83.31.92\:3000/)) {
    //console.log('its test: ' + $window.location.host);
    this.API_URL = 'http://202.83.31.92:3000';
    return this.API_URL;
  } else {
    //console.log('its dev: ' + $window.location.host);
    this.API_URL = 'http://' + $window.location.host;
    return this.API_URL;
  }
}])


//.factory('Categories', function ($resource, API_HOST) {
.factory('Categories', ["$resource", "ConfigService", function ($resource, ConfigService) {
    return $resource(ConfigService.API_URL + '/newcats/page/:pageId/:activeFilter', {
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
  .factory('SingleCat', ["$resource", "ConfigService", function ($resource, ConfigService) {
    return $resource(ConfigService.API_URL + '/newcats/:newCatId', {
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

.factory('SubCategories', ["$resource", "ConfigService", function ($resource, ConfigService) {
  return $resource(ConfigService.API_URL + '/subCats/:catId/:pageId/:activeFilter', {
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


.factory('SubCat', ["$resource", "ConfigService", function ($resource, ConfigService) {
  return $resource(ConfigService.API_URL + '/singleSubCat/:subCatId', {
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
    $urlRouterProvider.otherwise('/home');

    // Home state routing
    $stateProvider
      .state('home', {
        url: '/home',
       templateUrl: 'modules/core/views/home.client.view.html',
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
        url: 'privacy',
        templateUrl: 'modules/core/views/privacy.client.view.html',
        module: 'public'
      });
 }
]).run(["$rootScope", "$state", "$stateParams", function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
}]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$http', '$location', '$localStorage', '$modal', '$timeout', '$state',
 function ($scope, Authentication, Menus, $http, $location, $localStorage, $modal, $timeout, $state) {
    $scope.authentication = Authentication;
    $scope.authentication.user = $localStorage.user;

    $scope.gotoState = function () {
      if ($scope.authentication.user) {
        $state.go("reciflix.recipes");
      } else {
        $state.go("home");
      }
    }


    $scope.goToSearchRecipes = function (inputQuery) {
      $state.go("reciflix.recipes.searchedrecipes", {
        query: inputQuery
      });
      $scope.inputQuery = '';
    }


    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');

    $scope.toggleCollapsibleMenu = function () {
      //console.log('Checking toggleCollapsibleMenu ');
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });


    $scope.OpenSignIn = function () {
      $scope.signFun = true;
      //console.log('Sign In function is called');
      $scope.modalInstance = $modal.open({
        templateUrl: 'modules/categories/views/modals/signIn-modal.html',
        controller: 'AuthenticationController',
        backdrop: "static",
        scope: $scope
      });
      $timeout(function () {
        $scope.signFun = false;
      }, 3000);
    }

    $scope.cancel = function () {
      $scope.modalInstance.dismiss('cancel');
    };


    $scope.signout = function () {
      $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;
      $http.post('/users/signout').success(function (response) {
        //console.log('Signout callback : ' + JSON.stringify(response));
        $scope.authentication.user = '';
        delete $localStorage.token;
        delete $localStorage.user;
        $state.go('reciflix.recipes');
      });
    };

}]);

'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$state', 'ProspectiveEmail', '$modal', '$timeout',
 function ($scope, Authentication, $state, ProspectiveEmail, $modal, $timeout) {

    $scope.authentication = Authentication;

    if (navigator.userAgent.match(/Android/i)) {
      //console.log('Android user came');
      //alert('Android user came');
      $scope.androidUser = true;
    } else if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
      $scope.iosUser = true;
    }


    $scope.OpenSignIn = function () {
      $scope.signFun = true;
      //console.log('Sign In function is called');
      $scope.modalInstance = $modal.open({
        templateUrl: 'modules/categories/views/modals/signIn-modal.html',
        controller: 'AuthenticationController',
        backdrop: "static",
        scope: $scope
      });
      $timeout(function () {
        $scope.signFun = false;
      }, 3000);
    }

    $scope.cancel = function () {
      $scope.modalInstance.dismiss('cancel');
    };
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

    .state('reciflix.recipes.favRecipes', {
      url: "/favorite/recipes",
      views: {
        'child-view@reciflix.recipes': {
          templateUrl: "modules/recipes/views/favoriteRecipes.html",
          controller: 'myFavoritesCtrl',
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

    .state('reciflix.recipes.catrecipes.singlerecipes', {
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

angular.module('recipes')

.controller('myFavoritesCtrl', ["$scope", "$stateParams", "$http", "MyFavRecipes", "$localStorage", "Authentication", function ($scope, $stateParams, $http, MyFavRecipes, $localStorage, Authentication) {
  $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;
  $scope.authentication = Authentication;
  $scope.vm = {
    currentPage: 1
  };
  $scope.itemsPerPage = 6;
  $scope.maxSize = 5;

  $scope.recipesUnderFavorite = function (pageNum) {
    //$scope.recipes = [];
    $scope.loading = true;
    MyFavRecipes.query({
      pageId: (pageNum - 1),
      uId: Authentication.user._id
    }, function (res) {
      $scope.loading = false;
      //console.log('REsponse of recipesUnderFavorite query is : ' + JSON.stringify(res));
      if (pageNum === 1)
        $scope.totalItems = res.count;
      $scope.recipes = res.recipes;
    })
  }

  $scope.pageChanged = function () {
    $scope.recipesUnderFavorite($scope.vm.currentPage);
  }

}]);

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

.controller('RecipesCtrl', ["$scope", "$localStorage", "$state", "Categories", "$modal", "SingleCat", "NotificationFactory", "UserSuggestion", "Authentication", function ($scope, $localStorage, $state, Categories, $modal, SingleCat, NotificationFactory, UserSuggestion, Authentication) {
  $scope.authentication = Authentication;
  $scope.categoryFun = function () {
    if ($state.current.name === 'reciflix.recipes') {
      //console.log('Category function in parent controller');
      $scope.loading = true;
      Categories.query({
        pageId: 999,
        activeFilter: 1 // get only active cats
      }).$promise.then(function (res) {
        $scope.loading = false;
        $scope.categories = res;
      }).catch(function (err) {
        //console.log('Error happened : ' + JSON.stringify(err));
        alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
      });
    }

  };


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


.controller('SubCategoriesCtrl', ["$scope", "$stateParams", "SubCategories", "$modal", "$localStorage", "$state", "Authentication", function ($scope, $stateParams, SubCategories, $modal, $localStorage, $state, Authentication) {
  $scope.authentication = Authentication;
  //$scope.catName = $stateParams.catName;
  $scope.catId = $stateParams.catId;
  //$scope.SubCatName = $stateParams.SubCatName;
  $scope.subCatFun = function () {

    if ($stateParams.catId && $state.current.name === 'reciflix.recipes.subcats') {
      //console.log('$stateParams.catId is called : ' + $stateParams.catId);
      $scope.loading = true;
      SubCategories.query({
        catId: $stateParams.catId,
        pageId: 999,
        activeFilter: 1 // get only active sub cats
      }).$promise.then(function (res) {
        //console.log('Successfullly fetched sub categories11111 :' + JSON.stringify(res))
        $scope.loading = false;
        $scope.CatObjWithSubCats = res;
      }).catch(function (err) {
        //console.log('Error happened : ' + JSON.stringify(err));
        alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
      });

    }


  };
}])

.controller('SubCatRecipesCtrl', ["$scope", "$stateParams", "SubCategoryRecipes", "$rootScope", "Recipe", "$sce", "CategoryRecipes", "$state", "Authentication", function ($scope, $stateParams, SubCategoryRecipes, $rootScope, Recipe, $sce, CategoryRecipes, $state, Authentication) {
  $scope.authentication = Authentication;
  $scope.catId = $stateParams.catId;
  $scope.subCatId = $stateParams.subCatId;
  $scope.CatIdForRecipes = $stateParams.CatIdForRecipes;

  $scope.vm = {
    currentPage: 1
  };
  $scope.itemsPerPage = 6;
  $scope.maxSize = 5;


  if ($stateParams.subCatId) {

    $scope.recipesUnderSubCat = function (pageNum) {
      //console.log('recipesUnderSubCat is called ')
      $scope.loading = true;
      SubCategoryRecipes.query({
        subCatId: $stateParams.subCatId,
        pageId: (pageNum - 1)
      }).$promise.then(function (res) {
        //console.log('Successfullly fetched sub category Recipes :' + JSON.stringify(res))
        $scope.loading = false;
        if (pageNum === 1)
          $scope.totalItems = res.recipeCount;
        res.catImageUrl = res.subCatsExist ? "https://s3.amazonaws.com/NewRF/" + res.imageName : "https://s3.amazonaws.com/NewRFSubCats/" + res.imageName;
        $scope.subCatRecipesObj = res;
      }).catch(function (err) {
        //console.log('Error happened : ' + JSON.stringify(err));
        alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
      });
    };
  }

  $scope.pageChanged = function () {
    //console.log('Page changed console and current page is : ' + $scope.vm.currentPage);
    $scope.recipesUnderSubCat($scope.vm.currentPage);
  }


  if ($stateParams.CatIdForRecipes) {
    $scope.recipesUnderSubCat = function (pageNum) {
      $scope.loading = true;
      CategoryRecipes.query({
        subCatId: $stateParams.CatIdForRecipes,
        pageId: (pageNum - 1)
      }).$promise.then(function (res) {
        //console.log('Successfullly fetched category Recipes :' + JSON.stringify(res))
        if (pageNum === 1)
          $scope.totalItems = res.recipeCount;
        $scope.loading = false;
        res.catImageUrl = res.subCatsExist ? "https://s3.amazonaws.com/NewRFSubCats/" + res.imageName : "https://s3.amazonaws.com/NewRF/" + res.imageName;
        $scope.subCatRecipesObj = res;
      }).catch(function (err) {
        //console.log('Error happened : ' + JSON.stringify(err));
        alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
      });
    }

  }

  $scope.getSingleRecipe = function () {
    Recipe.get({
      vrecipeId: $stateParams.recipeId
    }).$promise.then(function (res) {
      // console.log('Successfullly fetched Recipe :' + JSON.stringify(res))
      $scope.singleRecipe = res;
      $scope.youTubeRecipeURL = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + res.videoId + "?rel=0&iv_load_policy=3&amp;controls=1&amp;showinfo=0");

      //https://www.youtube.com/embed/iJUdcbCoIcA?rel=0&amp;controls=1&amp;showinfo=0
    }).catch(function (err) {
      //console.log('Error happened : ' + JSON.stringify(err));
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };
}])


.controller('SearchedRecipesCtrl', ["$scope", "$stateParams", "SearchedRecipes", "Authentication", function ($scope, $stateParams, SearchedRecipes, Authentication) {
  $scope.authentication = Authentication;
  $scope.vm = {
    currentPage: 1
  };
  $scope.itemsPerPage = 6;
  $scope.maxSize = 5;
  $scope.searchedQuery = $stateParams.query;

  $scope.recipesUnderSearchQuery = function (pageNum) {
    //console.log('Searched query is : ' + $stateParams.query);

    $scope.loading = true;
    SearchedRecipes.query({
      pageId: (pageNum - 1),
      searchQuery: $stateParams.query
    }, function (res) {
      $scope.loading = false;
      //console.log('REsponse of searched query is : ' + JSON.stringify(res));
      if (pageNum === 1)
        $scope.totalItems = res.count;
      $scope.recipes = res.recipes;
    }, function (err) {
      $scope.loading = false;
      $scope.recipes = [];
    })
  }

  $scope.pageChanged = function () {
    //console.log('Page changed console and current page is : ' + $scope.vm.currentPage);
    $scope.recipesUnderSearchQuery($scope.vm.currentPage);
  }



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

//Directive used to set Favorite and Like button

angular.module('recipes')
  .directive('myFavoriteIcon', ["$sce", "Authentication", "$state", "$http", "$localStorage", "RecipesFavCount", "UserFavorites", "$modal", function ($sce, Authentication, $state, $http, $localStorage, RecipesFavCount, UserFavorites, $modal) {
    return {
      restrict: 'A',
      scope: {
        favorite: '='
      },
      replace: true,
      template: '<i ng-class="emptyIcon ? \'fa fa-heart-o\' : \'fa fa-heart animatedIcon bounceIn\'" style="font-size:20px"></i>',
      link: function (scope, elem, attrs) {
        elem.on('click', function () {
          //console.log('Recipe favorite dir is called');
          scope.$apply(function () {
            if (Authentication.user) {
              //console.log('Recipe favorite dir is called under Authentication ');
              $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;
              if (scope.favorite) {
                //console.log('Scope .fav Recipe favorite dir is called under Authentication ');
                if (scope.emptyIcon) {
                  //console.log('Scope .emptyIcon Recipe favorite dir is called under Authentication ');
                  scope.emptyIcon = false;
                  Authentication.user.favorites.push(scope.favorite.videoId);
                  var favRecipe = scope.favorite;
                  favRecipe.favoritesCount = scope.favorite.favoritesCount + 1;
                  RecipesFavCount.update({
                    recipeId: favRecipe._id
                  }, favRecipe, function (res) {
                    //console.log('Recipe favorite cb');
                  }, function (err) {
                    scope.emptyIcon = true;
                  });
                } else {
                  scope.emptyIcon = true;
                  var favRecipe = scope.favorite;
                  Authentication.user.favorites.splice(Authentication.user.favorites.indexOf(scope.favorite.videoId), 1);
                  favRecipe.favoritesCount = scope.favorite.favoritesCount - 1;
                  RecipesFavCount.update({
                    recipeId: favRecipe._id
                  }, favRecipe, function (res) {
                    //console.log('Recipe Unfavorite cb');
                  }, function (err) {
                    scope.emptyIcon = false;
                  });
                }
                var user = {
                  firstName: Authentication.user.firstName,
                  lastName: Authentication.user.lastName,
                  favorites: scope.favorite.videoId,
                  provider: Authentication.user.provider
                }
                UserFavorites.update({
                  userId: Authentication.user._id
                }, user, function (res) {
                  //console.log('Details User Update fav  Service cb ');
                }, function (err) {
                  //scope.emptyIcon = true;
                });
              } else {
                console.log('It is off!');
              }
            } else {
              var modalInstance = $modal.open({
                templateUrl: 'modules/categories/views/modals/userNotLoggedIn-modal.html',
                backdrop: "static",
                scope: scope,
                controller: 'LoginSignUpModalCtrl'
              });
              modalInstance.result.then(function (booleanValue) {
                scope.modalInstance = $modal.open({
                  templateUrl: 'modules/categories/views/modals/signIn-modal.html',
                  controller: 'AuthenticationController',
                  backdrop: "static",
                  scope: scope,
                  resolve: {
                    SignUpCondition: function () {
                      return booleanValue;
                    }
                  }
                });
              }, function () {});



            }
          })
        });
        scope.$watch('favorite', function (newVal) {
          if (newVal) {
            var user = Authentication.user;
            if (user) {
              if (user.favorites.indexOf(newVal.videoId) == -1) {
                scope.emptyIcon = true;
              } else {
                scope.emptyIcon = false;
              }
            } else {
              scope.emptyIcon = true;
            }
          }
        });
      }
    };
  }])


.controller('LoginSignUpModalCtrl', ["$scope", "$modalInstance", "$modal", function ($scope, $modalInstance, $modal) {
  $scope.LogInModal = function () {
    $scope.SignUpCondition = false;
    $modalInstance.close();
  };
  $scope.SignUpModal = function () {
    $scope.SignUpCondition = true;
    $modalInstance.close($scope.SignUpCondition);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}])


.directive('myLikeIcon', ["$sce", "Authentication", "$state", "$http", "$localStorage", "RecipesFavCount", "UserFavorites", "$modal", function ($sce, Authentication, $state, $http, $localStorage, RecipesFavCount, UserFavorites, $modal) {
  return {
    restrict: 'A',
    scope: {
      likes: '='
    },
    replace: true,
    template: '<i ng-class=" emptyIcon ? \'fa fa-thumbs-o-up\' : \'fa fa-thumbs-up animatedIcon bounceIn\'" style="font-size:20px"></i>',
    link: function (scope, elem, attrs) {
      elem.on('click', function () {

        // console.log('Recipe likes dir is called');
        scope.$apply(function () {
          if (Authentication.user) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;
            if (scope.likes) {
              if (scope.emptyIcon) {
                scope.emptyIcon = false;
                Authentication.user.likes.push(scope.likes.videoId);
                var favRecipe = scope.likes;
                favRecipe.applikes = scope.likes.applikes + 1;
                RecipesFavCount.update({
                  recipeId: favRecipe._id
                }, favRecipe, function (res) {
                  //console.log('Recipe Liked cb ');
                }, function (err) {
                  scope.emptyIcon = true;
                });
              } else {
                scope.emptyIcon = true;
                var favRecipe = scope.likes;
                Authentication.user.likes.splice(Authentication.user.likes.indexOf(scope.likes.videoId), 1);
                favRecipe.applikes = scope.likes.applikes - 1;
                RecipesFavCount.update({
                  recipeId: favRecipe._id
                }, favRecipe, function (res) {
                  // console.log('Recipe UnLike cb');
                }, function (err) {
                  scope.emptyIcon = false;
                });
              }
              var user = {
                firstName: Authentication.user.firstName,
                lastName: Authentication.user.lastName,
                likes: scope.likes.videoId,
                provider: Authentication.user.provider
              }
              UserFavorites.update({
                userId: Authentication.user._id
              }, user, function (res) {
                //console.log('Details User Update Likes Service cb ');
              }, function (err) {
                scope.emptyIcon = true;
              });
            } else {}
          } else {

            var modalInstance = $modal.open({
              templateUrl: 'modules/categories/views/modals/userNotLoggedIn-modal.html',
              backdrop: "static",
              scope: scope,
              controller: 'LoginSignUpModalCtrl'
            });
            modalInstance.result.then(function (booleanValue) {
              scope.modalInstance = $modal.open({
                templateUrl: 'modules/categories/views/modals/signIn-modal.html',
                controller: 'AuthenticationController',
                backdrop: "static",
                scope: scope,
                resolve: {
                  SignUpCondition: function () {
                    return booleanValue;
                  }
                }
              });
            }, function () {});
          }
        })
      });

      scope.$watch('likes', function (newVal) {
        if (newVal) {
          var user = Authentication.user;
          if (user) {
            if (user.likes.indexOf(newVal.videoId) == -1) {
              scope.emptyIcon = true;
            } else {
              scope.emptyIcon = false;
            }
          } else {
            scope.emptyIcon = true;
          }
        }
      });
    }
  };
}])

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

.factory('CategoryRecipes', ["$resource", "ConfigService", function ($resource, ConfigService) {
  return $resource(ConfigService.API_URL + '/newRecipesForCatId/:subCatId/:pageId', {
    subCatId: '@subCatId',
    pageId: '@pageId'
  }, {
    'query': {
      method: 'GET',
      //isArray: true,
      timeout: 20000
    }
  });
}])


.factory('SubCategoryRecipes', ["$resource", "ConfigService", function ($resource, ConfigService) {
  return $resource(ConfigService.API_URL + '/newRecipesForSubCatId/:subCatId/:pageId', {
    subCatId: '@subCatId',
    pageId: '@pageId'
  }, {
    'query': {
      method: 'GET',
      //isArray: true,
      timeout: 20000
    }
  });
}])



.factory('SearchedRecipes', ["$resource", "ConfigService", function ($resource, ConfigService) {
  return $resource(ConfigService.API_URL + '/searchedVRecipesByIndexNew/:searchQuery/:pageId', {
    searchQuery: '@searchQuery',
    pageId: '@pageId'
  }, {
    'query': {
      method: 'GET',
      timeout: 20000
        //isArray: true
    }
  });
}])


.factory('Recipe', ["$resource", "ConfigService", function ($resource, ConfigService) {
  return $resource(ConfigService.API_URL + '/nVRecipes/:vrecipeId', {
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



.factory('RecipesFavCount', ["$resource", "ConfigService", function ($resource, ConfigService) {
  return $resource(ConfigService.API_URL + '/recipesFavCount/:recipeId', {
    recipeId: '@_id'
  }, {
    'update': {
      method: 'PUT'
    }
  });
}])


.factory('UserFavorites', ["$resource", "ConfigService", function ($resource, ConfigService) {
  return $resource(ConfigService.API_URL + '/userFavorites/:userId', {
    userId: '@_id'
  }, {
    'update': {
      method: 'PUT'
    }
  });
}])

.factory('MyFavRecipes', ["$resource", "ConfigService", function ($resource, ConfigService) {
  return $resource(ConfigService.API_URL + '/WebFavRecipes/:uId/:pageId', {
    uId: '@uId',
    pageId: '@pageId'
  }, {
    'query': {
      method: 'GET'
    }
  });
}])



.factory('UserSuggestion', ["$resource", "ConfigService", function ($resource, ConfigService) {
  return $resource(ConfigService.API_URL + '/users/suggestions/:pageId', {
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

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', '$localStorage', 'Users', '$state', '$modalInstance', 'SignUpCondition',
 function ($scope, $http, $location, Authentication, $localStorage, Users, $state, $modalInstance, SignUpCondition) {
    $scope.authentication = Authentication;
    if ($scope.authentication.user) $state.go('reciflix.recipes');

    if (navigator.userAgent.match(/Android/i)) {
      $scope.androidUser = true;
    } else if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
      $scope.iosUser = true;
    };


    $scope.buttonTextLogIn = 'Log In';
    $scope.buttonTextSignUp = 'Sign Up';
    if (SignUpCondition)
      $scope.condition1 = SignUpCondition;

    $scope.Login = function () {
      $scope.isDisabled = true;
      $scope.buttonTextLogIn = 'Logging In...';
      Users.Login.create($scope.credentials).$promise.then(function (res) {
        if (res.type === false) {
          $scope.errMsg = res.data;
          $scope.isDisabled = false;
          $scope.buttonTextLogIn = 'Log In';
          //$scope.updatingLogo = false;
        } else {
          $scope.errMsg = false;
          $scope.populateUserLocally(res);
        }
      }).catch(function (err) {
        alert('Looks like there is an issue with your connectivity, Please try after sometime!');
      });
    };

    $scope.SignUp = function () {
      $scope.buttonTextSignUp = 'Signing Up...';
      $scope.isDisabled = true;
      Users.Signup.create($scope.user).$promise.then(function (res) {
        if (res.type === false) {
          $scope.errMsg = res.data;
          $scope.isDisabled = false;
          $scope.buttonTextSignUp = 'Sign Up';
          //$scope.updatingLogo = false;
        } else {
          $scope.errMsg = false;
          $scope.populateUserLocally(res);
        }
      }).catch(function (err) {
        alert('Looks like there is an issue with your connectivity, Please try after sometime!');
      });
    };

    hello.init({
      google: '512199517355-keu3sicfllh719ghbveivg6ic40lq4dr.apps.googleusercontent.com',
      facebook: '1607966326154856'
    }, {
      scope: 'email'
    });

    $scope.populateUserLocally = function (respUser) {

      // console.log('Populate local user function , user details : ' + JSON.stringify(respUser));

      //$scope.updatingLogo = false;
      $scope.authentication.user = respUser;
      $localStorage.user = respUser;
      $localStorage.token = respUser.token;
      $scope.modalInstance.close();
      //$state.go('reciflix.recipes');
      if ($state.current.name === 'home') {
        $state.go('reciflix.recipes');
      } else {
        $state.go($state.current)
      }
    };


    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.googleAuthLogIn = function () {
      hello('google').login({
        scope: 'email',
        force: false
      }).then(function (gRes) {
        $http({
            method: "GET",
            url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + gRes.authResponse.access_token,
            data: null,
            dataType: 'json',
          })
          .success(function (data) {
            //console.log('User Profile2222222 is : ' + JSON.stringify(data));
            $scope.gUser = {
              firstName: data.given_name,
              lastName: data.family_name,
              email: data.email,
              provider: 'gmail'
            };
            Users.Signup.create($scope.gUser).$promise.then(function (res) {
              if (res.type === false) {
                $scope.errMsg = res.data;
                $scope.populateUserLocally(res.user);
              } else {
                $scope.errMsg = false;
                $scope.populateUserLocally(res);
              }
            }).catch(function (err) {
              alert('Looks like there is an issue with your connectivity, Please try after sometime!');
            });
          })
          .error(function (data, status) {
            $scope.errMsg = 'This seems to be Google login error. We willl look into it and let you know';
          });
      })
    };

    $scope.fbAuthLogIn = function () {
      hello('facebook').login().then(function (fbRes) {
        $http({
            method: "GET",
            url: 'https://graph.facebook.com/me?access_token=' + fbRes.authResponse.access_token,
            data: null,
            dataType: 'json',
          })
          .success(function (data) {
            //console.log('User Profile2222222 is : ' + JSON.stringify(data));
            $scope.fUser = {
              firstName: data.first_name,
              lastName: data.last_name,
              email: data.email,
              provider: 'fb'
            };
            Users.Signup.create($scope.fUser).$promise.then(function (res) {
              if (res.type === false) {
                $scope.errMsg = res.data;
                $scope.populateUserLocally(res.user);
              } else {
                $scope.errMsg = false;
                $scope.populateUserLocally(res);
              }
            }).catch(function (err) {
              alert('Looks like there is an issue with your connectivity, Please try after sometime!');
            });
          })
          .error(function (data, status) {
            $scope.errMsg = 'This seems to be Google login error. We willl look into it and let you know';
          });
      }, function (e) {
        console.log('Signin error: ' + e.error.message);
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


.factory('SignUpCondition', function () {
  return false;
})

//API_HOST is taken from single spot category.client.services.js
//.constant('API_HOST', 'http://localhost:3000')
//.constant('API_HOST', 'http://www.reciflix.com')

.factory('Users', ['$resource', 'ConfigService', function ($resource, ConfigService, $localStorage) {
  return {
    Signup: $resource(ConfigService.API_URL + '/users/signup', {}, {
      create: {
        method: 'POST',
        timeout: 30000
      }
    }),
    Login: $resource(ConfigService.API_URL + '/users/signin', {}, {
      create: {
        method: 'POST',
        timeout: 20000
      }
    }),
    AllUsers: $resource(ConfigService.API_URL + '/users/totalUsers/:pageId', {
      pageId: '@pageId'
    }, {
      query: {
        method: 'GET',
        timeout: 20000
      }
    }),
    UsageDetails: $resource(ConfigService.API_URL + '/users/usage-details-collection/:pageId', {
      pageId: '@pageId'
    }, {
      query: {
        method: 'GET',
        timeout: 20000
      }
    }),
    UsersSuggestion: $resource(ConfigService.API_URL + '/users/suggestions/:pageId', {
      pageId: '@pageId'
    }, {
      query: {
        method: 'GET',
        timeout: 20000
      }
    })
  }
}]);
