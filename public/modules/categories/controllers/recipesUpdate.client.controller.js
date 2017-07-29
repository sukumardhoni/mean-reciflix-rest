'use strict';

// Recipes Edit controller
angular.module('categories').controller('RecipesUpdateCtrl', function ($scope, $state, $localStorage, Recipe, $rootScope, Categories, SubCategories, SubCategoryRecipes, CategoryRecipes, $sce, RecipesService,NotificationFactory) {



	$scope.getAllCats = function () {
		Categories.query({
			pageId: 999,
			activeFilter: 3 // get all cats
		}).$promise.then(function (res) {
			$scope.cats = res;
		}).catch(function (err) {
			//console.log('Error happened : ' + JSON.stringify(err));
			alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
		});
	};



	$scope.getSubCats = function (addsubCats) {


		if (addsubCats) {
			$scope.catSelected = addsubCats
		}

		console.log('Selected cat for sub cats : ' + JSON.stringify($scope.catSelected));

		SubCategories.query({
			catId: $scope.catSelected.catId,
			pageId: 999,
			activeFilter: 3 // get all sub cats
		}).$promise.then(function (res) {
			//console.log('Successfullly fetched sub categories11111 :' + JSON.stringify(res))
			if (res.subCatsExist) {
				$scope.subCats = res.subCats;
			} else {
				$scope.getCatRecipes($scope.catSelected.catId);
			}

		}).catch(function (err) {
			//console.log('Error happened : ' + JSON.stringify(err));
			alert('Looks like there is an issue with your connectivity, Please check your network connection or Please try after sometime!');
		});
	};

	$scope.getCatRecipes = function (CatId) {
		//console.log('$scope.getCatRecipes func is called : ' + CatId);

		CategoryRecipes.query({
			subCatId: CatId,
			pageId: 999
		}).$promise.then(function (res) {
			//console.log('Successfullly fetched category Recipes :' + JSON.stringify(res))
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
	}


	$scope.getIframeSrc = function (videoId) {
		return $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + videoId)
	}

	$scope.availableTags = ['Chicken', 'Mutton', 'Veg', 'Non-veg', 'Curry', 'Gravy', 'Salads', 'Desserts', 'Cake', 'Sweets', 'Snacks', 'Appetizers', 'Breads', 'Dipping Sides', 'Kids', 'Festival', 'Diwali', 'Ganesh Festival', 'Sankranthi', 'Rakhi', 'Dushera', 'Healthy', 'Soft Drinks', 'Indo chineese', 'South-Indian', 'Soup', 'Chutney', 'Indian Pickels', 'Pregnancy Diet', 'Egg Less', 'Eggs', 'Fruits', 'Prawns'];

	$scope.availableCats = [];
	$scope.availableSubCats = [];


	$scope.getSubCatRecipes = function (subCats) {


		if (subCats) {
			$scope.subCatSelected = subCats
		}

		$scope.loading = true;
		 console.log('Selected Sub cat for Recipes : ' + JSON.stringify($scope.subCatSelected));
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

		item.submitted.by = $localStorage.user.displayName;

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
	};




	$scope.recipe = {};
	$scope.savedVideoId = [];
	$scope.addRecipe = function () {
		$scope.showSpinner = true;
		//console.log('fectch all cats '+JSON.stringify(this.cats))
		// console.log('viedeo id : ' + JSON.stringify($scope.recipe.recipeVedioIds));
		 //var videoString = $scope.recipe.recipeVedioIds;
		var regEx = /([^,]+)/g;
		var result = $scope.recipe.recipeVedioIds.match(regEx);
		console.log('result : ' + JSON.stringify(result));
		for (var i = 0; i < result.length; i++) {
			$scope.youtubeApi(result[i])
		//	console.log('result Single obj: ' + JSON.stringify(result[i]));
		}

		$scope.showSpinner = false;
	
		$scope.recipe.recipeVedioIds = ""; 
	}
	$scope.errVideos = []
	$scope.youtubeApi = function (videoId) {
		console.log('youtubeApi: ' + JSON.stringify(videoId));

		if (videoId) {
			var apiKey = "AIzaSyA4LdL9Gbg1ww3vtOm-_nkofFXE1uxZpXk";
			var gUrl = "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key=" + apiKey + "&part=snippet,statistics,contentDetails";
			$.get(gUrl, function (data) {
					//console.log('sucess call.' + JSON.stringify(data.items));
					if (data.items.length === 0) {
						console.log('item  empty array')
						$scope.errVideos.push(videoId)
						$scope.$apply(function () {
							$scope.errVideos
							$scope.errMsg = "Recipe's not uploaded with this videoId's";
						});
					} else {
						$scope.formObject(data);
						//console.log('item non  empty array')
					}
				})
				.error(function (data, status, headers, config) {
					$scope.errMsg = 'the following recipe is not saved with videoId ' + videoId
					console.log('Error while saving this Video Id details in rest.' + JSON.stringify(data));
					console.log('Error while saving this Video Id details in rest.' + videoId);
				});
		}
	}

$scope.youtubeArr = [];

	$scope.formObject = function (data) {
		/* console.log('catSelected' + JSON.stringify($scope.catSelected))
		console.log('subCatSelected' + JSON.stringify($scope.subCatSelected))
		console.log('local user ' + JSON.stringify($localStorage.user)) */
		$scope.mvObjt = {};
		$scope.mvObjt.submitted = {};
		$scope.mvObjt.subcats = [];
		if ($scope.catSelected.subCatsExist == false) {
			console.log('if ')

			$scope.mvObjt.subcats = [];
		} else {
			console.log('else')
			$scope.mvObjt.subcats.push($scope.subCatSelected.subCatId);
		}
		$scope.mvObjt.cats = [];
		$scope.mvObjt.categories = [];
		var videoData = data.items[0];
		$scope.mvObjt.title = videoData.snippet.title;
		$scope.mvObjt.recipeId = videoData.snippet.title.replace(/\s/g, "-");
		$scope.mvObjt.videoId = videoData.id;
		$scope.mvObjt.author = videoData.snippet.channelTitle;
		$scope.mvObjt.published = videoData.snippet.publishedAt;
		$scope.mvObjt.submitted.by = $localStorage.user.displayName;
		$scope.mvObjt.submitted.data = new Date();
		$scope.mvObjt.duration = parseInt(convert_time(videoData.contentDetails.duration));
		$scope.mvObjt.views = videoData.statistics.viewCount;
		$scope.mvObjt.rank = 0;
		$scope.mvObjt.likes = videoData.statistics.likeCount;
		$scope.mvObjt.dislikes = videoData.statistics.dislikeCount;
		$scope.mvObjt.ytlikes = videoData.statistics.likeCount;
		$scope.mvObjt.applikes = 0;
		$scope.mvObjt.rfpoints = 0;

		$scope.mvObjt.description = videoData.snippet.description;
		$scope.mvObjt.notes = 'added new notes';
		$scope.mvObjt.state = 0;
		$scope.mvObjt.active = $scope.catSelected.active;
		$scope.mvObjt.tags = videoData.snippet.tags;
		$scope.mvObjt.cats.push($scope.catSelected.catId);
		$scope.mvObjt.categories.push($scope.catSelected.catId);

		//$scope.mvObjt.channelTitle = videoData.snippet.channelTitle;
		//$scope.mvObjt.region = ["Tollywood"];
		var dfltImg = 'https://i1.ytimg.com/vi/' + videoData.id + '/default.jpg';
		var mqdfltImg = 'https://i1.ytimg.com/vi/' + videoData.id + '/mqdefault.jpg';
		var hqdfltImg = 'https://i1.ytimg.com/vi/' + videoData.id + '/hqdefault.jpg';
		var sddfltImg = 'https://i1.ytimg.com/vi/' + videoData.id + '/sddefault.jpg';
		var maxresdfltImg = 'https://i1.ytimg.com/vi/' + videoData.id + '/sddefault.jpg';
		$scope.mvObjt.images = {
			dft: dfltImg,
			mq: mqdfltImg,
			hq: hqdfltImg,
			sd: sddfltImg,
			maxres: maxresdfltImg
		};
		//console.log('form object data ' + JSON.stringify($scope.mvObjt))

		//push every youtube video obj in to an array
		$scope.youtubeArr.push($scope.mvObjt)
		console.log('youtube array'+JSON.stringify($scope.youtubeArr.length))
		//save recipes to server 
		/* RecipesService.save($scope.mvObjt, function (res) {
			
			console.log('Successfully updated Recipe' + JSON.stringify(res));
			if(res.msg){
				$scope.savedVideoId.push(res.alreadySavedVideoId)
				console.log('saved video Id '+JSON.stringify($scope.savedVideoId))
				$scope.error = res.msg
			}else{
				console.log('New video saved')
			NotificationFactory.success('New recipes Added sucessfully');
			}
		}, function (errorResponse) {
			console.log('errorResponse ' + JSON.stringify(errorResponse));
			$scope.error = errorResponse.data.message;
		}); */
	}
	

	function convert_time(duration) {
		var a = duration.match(/\d+/g);

		if (duration.indexOf('M') >= 0 && duration.indexOf('H') === -1 && duration.indexOf('S') === -1) {
			a = [0, a[0], 0];
		}

		if (duration.indexOf('H') >= 0 && duration.indexOf('M') === -1) {
			a = [a[0], 0, a[1]];
		}
		if (duration.indexOf('H') >= 0 && duration.indexOf('M') === -1 && duration.indexOf('S') === -1) {
			a = [a[0], 0, 0];
		}

		duration = 0;

		if (a.length === 3) {
			duration = duration + parseInt(a[0]) * 3600;
			duration = duration + parseInt(a[1]) * 60;
			duration = duration + parseInt(a[2]);
		}

		if (a.length === 2) {
			duration = duration + parseInt(a[0]) * 60;
			duration = duration + parseInt(a[1]);
		}

		if (a.length === 1) {
			duration = duration + parseInt(a[0]);
		}
		var h = Math.floor(duration / 3600);
		var m = Math.floor(duration % 3600 / 60);
		var s = Math.floor(duration % 3600 % 60);
		return ((h > 0 ? h + "h:" + (m < 10 ? "0" : "") : "") + m + "m:" + (s < 10 ? "0" : "") + s + "s");
	}







})
