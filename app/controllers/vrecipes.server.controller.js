'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('./errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	Vrecipe = mongoose.model('Vrecipe');


/*

exports.create = function (req, res) {

	var vrecipe = new VIdRecipe();
	vrecipe.title = req.body.title;
	vrecipe.videoId = req.body.videoId;
	vrecipe.author = req.body.author;
	vrecipe.published = req.body.published;
	vrecipe.submitted.by = req.body.submitted.by;
	vrecipe.duration = req.body.duration;
	vrecipe.views = req.body.views;
	vrecipe.likes = req.body.likes;
	vrecipe.dislikes = req.body.dislikes;
	vrecipe.description = req.body.description;
	vrecipe.notes = req.body.notes;
	vrecipe.state = req.body.state;
	vrecipe.active = req.body.active;
	vrecipe.tags = req.body.tags;
	vrecipe.categories = req.body.categories;
	vrecipe.images.dft = req.body.images.dft;
	vrecipe.images.mq = req.body.images.mq;
	vrecipe.images.hq = req.body.images.hq;
	vrecipe.images.sd = req.body.images.sd;
	vrecipe.save(function (err, cbRecipe) {
		if (err) {
			if (err.code == 11000) {
				res.send({
					ErrMessage: 'Recipe already exsists'
				});
			} else {
				res.send(err);
			}
		} else {
			res.jsonp(cbRecipe);
		}
	});
}

*/




/**
 * Create a vrecipe
 */
exports.create = function(req, res) {
	var vrecipe = new Vrecipe(req.body);
	//vrecipe.user = req.user;

	vrecipe.save(function(err) {
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
exports.read = function(req, res) {
	res.json(req.vrecipe);
};

/**
 * Update a vrecipe
 */
exports.update = function(req, res) {
	var vrecipe = req.vrecipe;

	vrecipe = _.extend(vrecipe, req.body);

	vrecipe.save(function(err) {
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
 * Delete an article
 */
exports.delete = function(req, res) {
	var vrecipe = req.vrecipe;

	vrecipe.remove(function(err) {
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
 * List of Articles
 */
exports.list = function(req, res) {
	Vrecipe.find().sort('-created').populate('user', 'displayName').exec(function(err, vrecipes) {
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
exports.vrecipeByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Vrecipe is invalid'
		});
	}

	Vrecipe.findById(id).populate('user', 'displayName').exec(function(err, vrecipe) {
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
exports.hasAuthorization = function(req, res, next) {
	if (req.vrecipe.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
