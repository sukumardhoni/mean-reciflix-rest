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
      $state.go('home');
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

.controller('CategoryCtrl', function ($scope, $localStorage, $state, Categories, $modal, SingleCat, Upload, $timeout, ConfigService) {
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
})

.controller('DelCatCtrl', function ($scope, $modalInstance) {
  $scope.deleteCatConfirm = function () {
    $modalInstance.close();
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})

.controller('SubCatCtrl', function ($scope, $stateParams, SubCategories, $modal, SubCat, $localStorage, Upload, $timeout, $state, ConfigService) {
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
        subCatId: subCat.subCatId
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
})

.controller('DelSubCatCtrl', function ($scope, $modalInstance) {
  $scope.deleteSubCatConfirm = function () {
    $modalInstance.close();
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})
