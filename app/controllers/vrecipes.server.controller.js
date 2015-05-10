'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('./errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	Vrecipe = mongoose.model('Vrecipe');

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
 * Delete an vrecipe
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
 * Delete all vrecipes
 */
exports.cleanAllVRecipes = function(req, res) {

  	Vrecipe.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json({'message':'successfully deleted all vrecipes'});
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
