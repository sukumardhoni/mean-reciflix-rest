'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');


exports.userFavorites = function (req, res) {
	User.findOne({
		_id: req.params.id
	}, function (err, user) {
		if (user === null)
			return res.status(204).send({
				message: 'No User is available with id: '
			});
		if (user.favorites.indexOf(req.body.favorites) === -1)
			user.favorites.push(req.body.favorites);
		return user.save(function (err, usercb) {
			if (err) {
				res.status(400).send(err);
			} else {
				res.jsonp(usercb);
			}
		});
	});
};


exports.ensureAuthorized = function (req, res, next) {
	var bearerToken;
	var bearerHeader = req.headers.authorization;
	if (typeof bearerHeader !== 'undefined') {
		var bearer = bearerHeader.split(' ');
		if (bearer[1] === 'undefined') {
			res.send(403);
		} else {
			bearerToken = bearer[1];
			req.token = bearerToken;
			next();
		}
	} else {
		res.send(403);
	}
};

exports.checkingUser = function (req, res, next) {
	User.findOne({
		token: req.token
	}, function (err, user) {
		if (err) {
			res.json({
				type: false,
				data: 'Error occured: ' + err
			});
		} else {
			next();
		}
	});
};


/**
 * Extend user's controller
 */
module.exports = _.extend(
	require('./users/users.authentication.server.controller'),
	require('./users/users.authorization.server.controller'),
	require('./users/users.password.server.controller'),
	require('./users/users.profile.server.controller')
);
