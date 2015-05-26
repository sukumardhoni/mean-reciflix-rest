'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('./errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	Vrecipe = mongoose.model('Vrecipe'),
	sampleJSON = require('../assets/vidsample.json');


/**
 * Create a vrecipe
 */
exports.create = function (req, res) {
	var vrecipe = new Vrecipe(req.body);
	//vrecipe.user = req.user;

	vrecipe.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(vrecipe);
		}
	});
};


/**
 * Show the current vrecipe
 */
exports.read = function (req, res) {
	res.json(req.vrecipe);
};




/**
 * Update a vrecipe
 */
exports.update = function (req, res) {
	var vrecipe = req.vrecipe;

	vrecipe = _.extend(vrecipe, req.body);

	vrecipe.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(vrecipe);
		}
	});
};

/**
 * Delete an vrecipe
 */
exports.delete = function (req, res) {
	var vrecipe = req.vrecipe;

	vrecipe.remove(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(vrecipe);
		}
	});
};

/**
 * Delete all vrecipes
 */
/*exports.cleanAllVRecipes = function(req, res) {

  	Vrecipe.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json({'message':'successfully deleted all vrecipes'});
		}
	});
};*/


exports.cleanAllVRecipes = function (req, res) {
	return Vrecipe.remove({}, function (err) {
		if (!err) {
			res.send('Cleaned all Recipes');
		} else {
			res.send(err);
		}
	});
};



/**
 * List of Articles
 */
exports.list = function (req, res) {
	Vrecipe.find().sort('-created').populate('user', 'displayName').exec(function (err, vrecipes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(vrecipes);
		}
	});
};

/**
 * Vrecipe middleware
 */
exports.vrecipeByID = function (req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Vrecipe is invalid'
		});
	}

	Vrecipe.findById(id).populate('user', 'displayName').exec(function (err, vrecipe) {
		if (err) return next(err);
		if (!vrecipe) {
			return res.status(404).send({
				message: 'Vrecipe not found'
			});
		}
		req.vrecipe = vrecipe;
		next();
	});
};





/**
 * Vrecipe authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
	if (req.vrecipe.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};



exports.getVIdRecipesByTags = function (req, res) {
	Vrecipe.find({
		tags: req.params.tagName
	}, function (err, recipes) {
		if (!err) {
			if ((recipes.length === 0)) {
				res.status(204).send({
					'message': 'There are no recipe items available'
				});
			} else {
				return res.send(recipes);
			}
		} else {
			return console.log(err);
		}
	});
};

exports.getAllTags = function (req, res) {
	Array.prototype.unique = function () {
		var a = this.concat();
		for (var i = 0; i < a.length; ++i) {
			for (var j = i + 1; j < a.length; ++j) {
				if (a[i] === a[j])
					a.splice(j--, 1);
			}
		}
		return a;
	};
	var foundTags = [];
	return Vrecipe.find({}, function (err, recipes) {
		if (!err) {
			if (recipes.length === 0) {
				res.status(204).send({
					message: 'There are no items in the db'
				});
			} else {
				for (var i = 0; i < recipes.length; i++) {
					foundTags = foundTags.concat(recipes[i].tags);
				}
				res.jsonp(foundTags.unique());
			}
		} else {
			return res.send({
				message: 'No data found'
			});
		}
	}).sort({
		_id: 1
	}).skip(req.params.pageId * 50).limit(50);
};


exports.getAllCategories = function (req, res) {
	Array.prototype.unique = function () {
		var a = this.concat();
		for (var i = 0; i < a.length; ++i) {
			for (var j = i + 1; j < a.length; ++j) {
				if (a[i] === a[j])
					a.splice(j--, 1);
			}
		}
		return a;
	};
	var foundCategories = [];
	return Vrecipe.find({}, function (err, recipes) {
		if (!err) {
			if (recipes.length === 0) {
				res.status(204).send({
					message: 'There are no items in the db'
				});
			} else {
				for (var i = 0; i < recipes.length; i++) {
					foundCategories = foundCategories.concat(recipes[i].categories);
				}
				res.jsonp(foundCategories.unique());
			}
		} else {
			return res.send({
				message: 'No data found'
			});
		}
	}).sort({
		_id: 1
	}).skip(req.params.pageId * 50).limit(50);
};


exports.getVIdRecipesByCategories = function (req, res) {
	console.log('Recipes under category is called , CatName is : ' + req.params.CategoryName);
	Vrecipe.find({
		categories: req.params.CategoryName
	}, function (err, recipes) {
		if (!err) {
			if ((recipes.length === 0)) {
				res.status(204).send({
					'message': 'There are no recipe items available'
				});
			} else {
				return res.send(recipes);
			}
		} else {
			return console.log(err);
		}
	}).sort({
		_id: 1
	}).skip(req.params.pageId * 10).limit(10);
};
exports.getVIdRecipesByViews = function (req, res) {
	Vrecipe.find({
		'views': {
			$gt: req.params.maxViews,
			$lt: req.params.minViews
		}
	}, function (err, recipes) {
		if (!err) {
			if ((recipes.length === 0)) {
				res.status(204).send({
					'message': 'There are no recipe items available'
				});
			} else {
				return res.send(recipes);
			}
		} else {
			return console.log(err);
		}
	});
};

exports.getVIdRecipesByViewsAndTags = function (req, res) {
	Vrecipe.find({
		'views': {
			$gt: req.params.minViews,
			$lt: req.params.maxViews
		},
		'likes': {
			$gt: req.params.minLikes,
			$lt: req.params.maxLikes
		},
		'tags': req.params.tags
	}, function (err, recipes) {
		if (!err) {
			if ((recipes.length === 0)) {
				res.status(204).send({
					'message': 'There are no recipe items available"'
				});
			} else {
				return res.send(recipes);
			}
		} else {
			return console.log(err);
		}
	});
};

exports.getAllMyFavoriteVRecipes = function (req, res) {
	var videoIds = req.params.videoIds.split(',');
	var foundRecipes = [];
	for (var i = 0; i < videoIds.length; i++) {
		Vrecipe.findOne({
			videoId: videoIds[i]
		}, function (err, recipe) {
			if (!err) {
				foundRecipes.push(recipe);
				if (foundRecipes.length === videoIds.length) {
					res.jsonp(foundRecipes);
				}
			} else {
				return res.send({
					message: 'No data found'
				});
			}
		});
	}
};


exports.postSampleJSONData = function (req, res) {
	var data = sampleJSON;
	var finalVideosList = [];
	for (var i = 0; i < data.length; i++) {
		var recipe = new Vrecipe();
		recipe.title = data[i].title;
		recipe.videoId = data[i].videoId;
		recipe.notes = data[i].notes;
		recipe.tags = data[i].tags;
		recipe.description = data[i].description;
		recipe.dislikes = data[i].dislikes;
		recipe.likes = data[i].likes;
		recipe.views = data[i].views;
		recipe.duration = data[i].duration;
		recipe.author = data[i].author;
		recipe.categories = data[i].categories;
		recipe.submitted = data[i].submitted;
		recipe.save(function (err, cbRecipe) {
			if (err) {
				console.log(err);
			} else {
				finalVideosList.push(cbRecipe);
			}
		});
	}
	res.send({
		message: 'Recipe Items are added into db'
	});
};
