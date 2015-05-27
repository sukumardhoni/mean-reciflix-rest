'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');


/* Update Favorities and Likes on User Profile */


exports.userFavorites = function (req, res) {
	console.log('Update user fav video ids is called in server' + JSON.stringify(req.body));
	User.findOne({
		_id: req.params.uId
	}, function (err, user) {
		if (user === null)
			return res.status(204).send({
				message: 'No User is available with id: ' + req.params.id
			});
		if (req.body.favorites) {
			if (user.favorites.indexOf(req.body.favorites) === -1)
				user.favorites.push(req.body.favorites);
			else
				user.favorites.splice(user.favorites.indexOf(req.body.favorites), 1);
		} else if (req.body.likes) {
			if (user.likes.indexOf(req.body.likes) === -1)
				user.likes.push(req.body.likes);
		}
		user.provider = 'local';
		user.firstName = req.body.firstName;
		user.lastName = req.body.lastName;
		return user.save(function (err, usercb) {
			if (err) {
				res.status(400).send(err);
				console.log('Error on update fav vids into user : ' + err);
			} else {
				res.jsonp(usercb);
			}
		});
	});
}





/**
 * Update user details
 */
exports.update = function (req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function (err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function (err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function (req, res) {
	res.json(req.user || null);
};

exports.live = function (req, res) {
	res.json({
		'message': 'app is up and running'
	});
};
