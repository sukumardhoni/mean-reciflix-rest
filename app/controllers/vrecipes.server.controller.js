'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('./errors.server.controller'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  Vrecipe = mongoose.model('Vrecipe'),
  User = mongoose.model('User'),
  config = require('../../config/config'),
  agenda = require('../../schedules/job-schedule.js')(config.db),
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
exports.getRecipe = function (req, res) {
  res.json(req.vrecipe);
};




/**
 * Update a vrecipe
 */
exports.updateRecipe = function (req, res) {
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
exports.deleteRecipe = function (req, res) {
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
  Vrecipe.find().sort('-rank').populate('user', 'displayName').exec(function (err, vrecipes) {
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
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Recipe is invalid'
    });
  }
  //console.log('Called the single recipe params function');
  Vrecipe.findById(id).populate('user', 'displayName').exec(function (err, vrecipe) {
    if (err) return next(err);
    if (!vrecipe) {
      return res.status(404).send({
        message: 'Recipe not found'
      });
    }
    //user is successfully fetched single recipe save action into user usage details collection
    agenda.now('User_Usage_Details', {
      email: emailInfo,
      device: deviceInfo,
      action: 'vrecipeByID : ' + vrecipe._id
    });
    req.vrecipe = vrecipe;
    next();
  });
};


/**
 * New Vrecipe middleware
 */
exports.nVRecipeByID = function (req, res, next, id) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  Vrecipe.findOne({
    recipeId: id
  }).populate('user', 'displayName').exec(function (err, vrecipe) {
    if (err) return next(err);
    if (!vrecipe) {
      return res.status(404).send({
        message: 'Recipe not found'
      });
    }
    //user is successfully fetched single recipe save action into user usage details collection
    agenda.now('User_Usage_Details', {
      email: emailInfo,
      device: deviceInfo,
      action: 'vrecipeByID : ' + vrecipe._id
    });
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


exports.getRecipesBySubCats = function (req, res) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;

  console.log('Recipes under getRecipesBySubCats is called , SubCatName is : ' + req.params.SubCatName);
  console.log('Recipes under getRecipesBySubCats is called , PageId is : ' + req.params.pageId);
  if (req.params.pageId == 999) {
    Vrecipe.find({
      subcats: {
        $in: [req.params.SubCatName]
      }
    }).sort({
      rank: -1
    }).exec(function (err, recipes) {
      if (!err) {
        if ((recipes.length === 0)) {
          res.status(204).send({
            'message': 'There are no recipe items available'
          });
        } else {
          //user is successfully fetched list of recipes based on subcats save action into user usage details collection
          agenda.now('User_Usage_Details', {
            email: emailInfo,
            device: deviceInfo,
            action: 'getRecipesBySubCats : ' + req.params.SubCatName
          });
          //console.log('Recipes length is : ' + recipes.length);
          res.send(recipes);
        }
      } else {
        return console.log(err);
      }
    });

  } else {

    Vrecipe.find({
      subcats: {
        $in: [req.params.SubCatName]
      }
    }).sort({
      rank: -1
    }).skip(req.params.pageId * 6).limit(6).exec(function (err, recipes) {
      if (!err) {
        if ((recipes.length === 0)) {
          res.status(204).send({
            'message': 'There are no recipe items available'
          });
        } else {
          //user is successfully fetched list of recipes based on subcats save action into user usage details collection
          agenda.now('User_Usage_Details', {
            email: emailInfo,
            device: deviceInfo,
            action: 'getRecipesBySubCats : ' + req.params.SubCatName
          });
          //console.log('Recipes length is : ' + recipes.length);
          res.send(recipes);
        }
      } else {
        return console.log(err);
      }
    });
  }

};


exports.getVIdRecipesByCategories = function (req, res) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  //console.log('Recipes under category is called , CatName is : ' + req.params.CategoryName);
  //console.log('Recipes under category is called , PageId is : ' + req.params.pageId);
  Vrecipe.find({
    cats: {
      $in: [req.params.CategoryName]
    }
  }).sort({
    rank: -1
  }).skip(req.params.pageId * 5).limit(5).exec(function (err, recipes) {
    if (!err) {
      if ((recipes.length === 0)) {
        res.status(204).send({
          'message': 'There are no recipe items available'
        });
      } else {
        //user is successfully fetched list of recipes based on categories save action into user usage details collection
        agenda.now('User_Usage_Details', {
          email: emailInfo,
          device: deviceInfo,
          action: 'getVIdRecipesByCategories : ' + req.params.CategoryName
        });
        //console.log('Recipes length is : ' + recipes.length);
        res.send(recipes);
      }
    } else {
      return console.log(err);
    }
  });
};

exports.getVIdRecipesByCategories_Admin = function (req, res) {
  //console.log('Recipes under category is called , CatName is : ' + req.params.CategoryName);
  //console.log('Recipes under category is called , PageId is : ' + req.params.pageId);
  Vrecipe.find({
    cats: {
      $in: [req.params.CategoryName]
    }
  }).sort({
    rank: -1
  }).limit(25).exec(function (err, recipes) {
    if (!err) {
      if ((recipes.length === 0)) {
        res.status(204).send({
          'message': 'There are no recipe items available'
        });
      } else {
        //console.log('Recipes length is : ' + recipes.length);
        res.send(recipes);
      }
    } else {
      return console.log(err);
    }
  });
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

exports.getAllMyFavorites = function (req, res) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  var pageid = req.params.pageId;
  var pagelength = 5;

  User.findOne({
    _id: req.params.uId
  }, function (err, user) {
    if (!err) {
      //console.log(' User: ' + user.email + ', fav video ids length is : ' + user.favorites.length);
      var currentFavVideoids = user.favorites.slice(pageid * pagelength, (pageid * pagelength) + pagelength);
      var foundRecipes = [];
      if (currentFavVideoids.length === 0) {
        return res.status(204).send({
          message: 'No data found'
        });
      } else {
        for (var i = 0; i < currentFavVideoids.length; i++) {
          Vrecipe.findOne({
            videoId: currentFavVideoids[i]
          }, function (err, recipe) {
            if (!err) {
              foundRecipes.push(recipe);
              if (foundRecipes.length === currentFavVideoids.length) {
                //user is successfully fetched MyFav recipes save action into user usage details collection
                agenda.now('User_Usage_Details', {
                  email: emailInfo,
                  device: deviceInfo,
                  action: 'getAllMyFavorites : ' + user.displayName
                });
                res.jsonp(foundRecipes);
              }
            } else {
              return res.status(204).send({
                message: 'No data found'
              });
            }
          });
        }
      }
    } else {
      return res.status(204).send({
        message: 'No data found'
      });
    }
  });
};

//TODO to bs deleted after testing
exports.getAllSearchedVRecipes = function (req, res) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  var pageid = req.params.pageId;
  var pagelength = 5;
  var queries = req.params.query.split(' ');
  var foundRecipes = [];
  for (var i = 0; i < queries.length; i++) {
    Vrecipe.find({
      tags: {
        $regex: new RegExp('^' + queries[i].toLowerCase(), 'i')
      }
    }).sort({
      rank: -1
    }).skip(req.params.pageId * 5).limit(5).exec(function (err, recipes) {
      if (!err) {
        if (recipes.length === 0) {
          return res.status(204).send({
            message: 'No data found'
          });
        } else {
          foundRecipes.push(recipes);
          if (foundRecipes.length === queries.length) {
            //user is successfully fetched searched recipes save action into user usage details collection
            agenda.now('User_Usage_Details', {
              email: emailInfo,
              device: deviceInfo,
              action: 'getAllSearchedVRecipes : ' + emailInfo
            });
            res.jsonp(foundRecipes);
          }
        }
      } else {
        return res.send({
          message: 'No data found'
        });
      }
    });
  }
};



exports.getAllSearchedVRecipesByIndex = function (req, res) {
  var deviceInfo = req.headers.device;
  var emailInfo = req.headers.email;
  var pageid = req.params.pageId;
  var pagelength = 5;
  //var queries = req.params.query.split(' ');
  Vrecipe.find({
    $text: {
      $search: req.params.query
    }
  }).sort({
    rank: -1
  }).skip(req.params.pageId * 5).limit(5).exec(function (err, recipes) {
    if (!err) {
      if (recipes.length === 0) {
        return res.status(204).send({
          message: 'No data found'
        });
      } else {
        //user is successfully fetched searched recipes save action into user usage details collection
        agenda.now('User_Usage_Details', {
          email: emailInfo,
          device: deviceInfo,
          action: 'getAllSearchedVRecipes : ' + emailInfo
        });
        res.jsonp(recipes);
      }
    } else {
      return res.send({
        message: 'No data found'
      });
    }
  });

};



exports.updateVRecipesFavCount = function (req, res) {
  //console.log('Console @ updateVRecipesFavCount');
  Vrecipe.findOne({
    _id: req.params.recipeId
  }, function (err, vrecipe) {
    if (vrecipe === null)
      return res.status(204).send({
        message: 'No recipe item is available with id: ' + req.params.recipeId
      });
    vrecipe.favoritesCount = req.body.favoritesCount;
    vrecipe.applikes = req.body.applikes;
    return vrecipe.save(function (err) {
      if (!err) {
        res.json(vrecipe);
        //console.log('Successfully increment the fav count : ' + JSON.stringify(vrecipe));
      } else {
        res.send({
          message: 'No item were found with that id'
        });
      }
    });
  });
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
        //console.log(err);
      } else {
        finalVideosList.push(cbRecipe);
      }
    });
  }
  res.send({
    message: 'Recipe Items are added into db'
  });
};
