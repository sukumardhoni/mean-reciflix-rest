'use strict';

// Articles controller
angular.module('categories').controller('ReciflixCtrl', ['$scope', '$state', '$localStorage', '$location', '$http', 'Authentication', function ($scope, $state, $localStorage, $location, $http, Authentication) {
  $scope.authentication = Authentication;
  $scope.userName = $localStorage.user.displayName || 'ReciFlix Admin';
  $scope.localUser = $localStorage.user;
  $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;

  $scope.signout = function () {
    //console.log('Checking token when we click on sigout : ' + $localStorage.token);

    $http.post('/users/signout').success(function (response) {
      console.log(response.data);
      $scope.authentication = '';
      //console.log('before delete:::' + $localStorage.token);
      delete $localStorage.token;
      delete $localStorage.user;
      //console.log('after delete:::' + $localStorage.token);
      $state.go('signin');
    });
  };

}])




.controller('CategoryCtrl', function ($scope, $localStorage, $state, Categories, $modal, SingleCat, NotificationFactory) {
  $scope.categoryFun = function () {
    console.log('categoryFun is called');
    Categories.query({
      pageId: 999
    }).$promise.then(function (res) {
      $scope.categories = res;
    }).catch(function (err) {
      console.log('Error happened : ' + JSON.stringify(err));
      alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
    });
  };

  $scope.openModal = function () {
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


  $scope.getCatDetails = function (cat) {
    SingleCat.get({
      newCatId: cat._id
    }, function (res) {
      console.log('Sucessfully fetched category details: ' + JSON.stringify(res));
      $scope.cat = res;
    }, function (err) {
      console.log('Error occured while fetching category, Error details are : ' + JSON.stringify(err));
    });
  };




  $scope.createCat = function () {
    console.log('Console at create cat func. & cat details are : ' + JSON.stringify($scope.cat));
    SingleCat.save($scope.cat, function (res) {
      console.log('Sucessfully created category details: ' + JSON.stringify(res));
      $scope.categories.unshift(res);
      $scope.modalInstance.close();
    }, function (err) {
      console.log('Error occured while creating category, Error details are : ' + JSON.stringify(err));
    });
  };

  $scope.cancel = function () {
    $scope.modalInstance.dismiss('cancel');
  };

  $scope.updateCat = function () {
    console.log('Index value is : ' + $localStorage.indexVal);
    var indexVal = $localStorage.indexVal;
    SingleCat.update({
      newCatId: $scope.cat._id
    }, $scope.cat, function (res) {
      console.log('Sucessfully Updated category details: ' + JSON.stringify(res));
      $scope.categories.splice(indexVal, 1);
      $scope.categories.splice(indexVal, 0, res);
      delete $localStorage.indexVal;
      $scope.modalInstance.close();
    }, function (err) {
      console.log('Error occured while Updating category, Error details are : ' + JSON.stringify(err));
    });
  };

  $scope.displayCat = function (cat, index) {
    $localStorage.indexVal = index;
    $scope.modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/view-cat-modal.html',
      scope: $scope,
      controller: 'CategoryCtrl'
    });
    $scope.getCatDetails(cat);
  }

  $scope.deleteCat = function (cat) {
    //$scope.getCatDetails(cat);
    var modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/del-cat-modal.html',
      scope: $scope,
      controller: 'DelCatCtrl'
    });

    modalInstance.result.then(function () {
      console.log('Delete clicked on modal');
      var indexVal = $localStorage.indexVal;
      SingleCat.delete({
        newCatId: cat._id
      }, function (res) {
        console.log('Sucessfully deleted category details: ' + JSON.stringify(res));
        $scope.categories.splice(indexVal, 1);
        delete $localStorage.indexVal;
        $scope.modalInstance.close();
      }, function (err) {
        console.log('Error occured while deleteing category, Error details are : ' + JSON.stringify(err));
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
  console.log('SubCatCtrl is fetched and Stateparams is : ' + $stateParams.catId);
  $scope.subCatFun = function () {
    SubCategories.query({
      catId: $stateParams.catId
    }).$promise.then(function (res) {
      console.log('Successfullly fetched sub categories :' + JSON.stringify(res))
      $scope.subCats = res;
    }).catch(function (err) {
      console.log('Error happened : ' + JSON.stringify(err));
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
    console.log('Console at createSubCat. & cat details are : ' + JSON.stringify($scope.subCat));
    SubCategories.save({
      catId: $stateParams.catId
    }, $scope.subCat, function (res) {
      console.log('Sucessfully created SubCategories   details: ' + JSON.stringify(res));
      $scope.subCats.unshift(res);
      $scope.modalInstance.close();
    }, function (err) {
      console.log('Error occured while SubCategories creating , Error details are : ' + JSON.stringify(err));
    });
  };
  $scope.cancel = function () {
    $scope.modalInstance.dismiss('cancel');
  };

  $scope.getSingleSubCat = function (subCat, index) {
    $scope.modalName = "Update Sub-Category";
    $localStorage.indexVal = index;
    $scope.modalInstance = $modal.open({
      templateUrl: 'modules/categories/views/modals/create-sub-cat-modal.html',
      scope: $scope,
      controller: 'SubCatCtrl'
    });

    SubCat.get({
      subCatId: subCat._id
    }, function (res) {
      console.log('Sucessfully fetched category details: ' + JSON.stringify(res));
      $scope.subCat = res;
    }, function (err) {
      console.log('Error occured while fetching category, Error details are : ' + JSON.stringify(err));
    });
  };

  $scope.updateSubCat = function () {
    console.log('updateSubCat is fetched ' + JSON.stringify($scope.subCat));
    var indexVal = $localStorage.indexVal;
    SubCat.update({
      subCatId: $scope.subCat._id
    }, $scope.subCat, function (res) {
      console.log('Sucessfully updated sub category details: ' + JSON.stringify(res));
      $scope.subCats.splice(indexVal, 1);
      $scope.subCats.splice(indexVal, 0, res);
      delete $localStorage.indexVal;
      $scope.modalInstance.close();
    }, function (err) {
      console.log('Error occured while updating sub category, Error details are : ' + JSON.stringify(err));
    });
  };

})
