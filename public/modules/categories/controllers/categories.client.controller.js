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

.controller('CategoryCtrl', function ($scope, $localStorage, $state, Categories, $modal, SingleCat, NotificationFactory) {
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




  $scope.createCat = function () {
    SingleCat.save($scope.cat, function (res) {
      $scope.categories.push(res);
      $scope.modalInstance.close();
    }, function (err) {
      //console.log('Error occured while creating category, Error details are : ' + JSON.stringify(err));
    });
  };

  $scope.cancel = function () {
    $scope.modalInstance.dismiss('cancel');
  };

  $scope.updateCat = function () {
    var indexVal = $localStorage.indexVal;
    SingleCat.update({
      newCatId: $scope.cat.catId
    }, $scope.cat, function (res) {
      $scope.categories.splice(indexVal, 1);
      $scope.categories.splice(indexVal, 0, res);
      delete $localStorage.indexVal;
      $scope.modalInstance.close();
    }, function (err) {
      //console.log('Error occured while Updating category, Error details are : ' + JSON.stringify(err));
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
})

.controller('DelCatCtrl', function ($scope, $modalInstance) {
  $scope.deleteCatConfirm = function () {
    $modalInstance.close();
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})

.controller('SubCatCtrl', function ($scope, $stateParams, SubCategories, $modal, SubCat, $localStorage) {
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
    console.log('Want to del sub cat details are :' + JSON.stringify(subCat));
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
})

.controller('DelSubCatCtrl', function ($scope, $modalInstance) {
  $scope.deleteSubCatConfirm = function () {
    $modalInstance.close();
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})
