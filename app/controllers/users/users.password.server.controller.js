'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	config = require('../../../config/config'),
	agenda = require('../../../schedules/job-schedule.js')(config.db),
	nodemailer = require('nodemailer'),
	async = require('async'),
	crypto = require('crypto'),
	jwt = require('jwt-simple'),
	smtpTransport = require('nodemailer-smtp-transport');

//var smtpTransport = nodemailer.createTransport(config.mailer.options);
var transporter = nodemailer.createTransport(smtpTransport(config.mailer.options));

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function (req, res, next) {


	var token = '';
	if (req.body.email) {
		User.findOne({
			email: req.body.email
		}, '-salt -password', function (err, user) {
			if (!user) {
				return res.status(400).send({
					message: 'No account with that email has been found'
				});
			} else if (user.provider !== 'local') {
				return res.status(400).send({
					message: 'It seems like you connected using your ' + user.provider + ' account'
				});
			} else {
				crypto.randomBytes(20, function (err, buffer) {
					token = buffer.toString('hex');
					user.resetPasswordToken = token;
					user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
					user.save(function (err) {
						if (!err) {
							console.log('New passwor reset method is called by using agenda');
							agenda.now('Recovery_Link_Email', {
								email: user.email,
								displayName: user.displayName,
								url: 'http://' + req.headers.host + '/#!/password/reset/' + token
							});
							res.send({
								message: 'An email has been sent to ' + user.email + ' with further instructions.'
							});
						} else {
							console.log('#### errror while reseting password, err is:' + err);
							res.send({
								message: 'There is some issue while reseting your password please try after sometime.'
							});
						}
					});
				});
			}
		});
	} else {
		return res.status(400).send({
			message: 'Email field must not be blank'
		});
	}
};


/**
 * Reset password GET from email token
 */
exports.validateResetToken = function (req, res) {
	User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: {
			$gt: Date.now()
		}
	}, function (err, user) {
		if (!user) {
			return res.redirect('/#/password/reset/invalid');
		}
		res.redirect('/#/password/reset/' + req.params.token);
	});
};

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {
	// Init Variables
	var passwordDetails = req.body;
	User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: {
			$gt: Date.now()
		}
	}, function (err, user) {
		if (!err && user) {
			if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
				user.password = passwordDetails.newPassword;
				user.resetPasswordToken = undefined;
				user.resetPasswordExpires = undefined;
				var secret = 'www';
				var payload = {
					email: user.email
				};
				var token = jwt.encode(payload, secret);
				user.token = token;
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
								//done(err, user);
								agenda.now('Password_Changed_Email', {
									email: user.email,
									displayName: user.displayName
								});
							}
						});
					}
				});
			} else {
				return res.status(400).send({
					message: 'Passwords do not match'
				});
			}
		} else {
			return res.status(400).send({
				message: 'Password reset token is invalid or has expired.'
			});
		}
	});
};

/**
 * Change Password
 */
exports.changePassword = function (req, res) {
	// Init Variables
	var passwordDetails = req.body;

	console.log('Change Password methos is called : ' + JSON.stringify(passwordDetails));

	if (req.user) {
		if (passwordDetails.newPassword) {
			User.findById(req.body._id, function (err, user) {
				if (!err && user) {
					user.verifyPassword(passwordDetails.currentPassword, function (err, isMatch) {
						if (isMatch) {
							console.log('Current Password is match : ' + passwordDetails.currentPassword);
							if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
								user.password = passwordDetails.newPassword;
								var secret = 'www';
								var payload = {
									email: user.email
								};
								var token = jwt.encode(payload, secret);
								user.token = token;
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
												res.send({
													message: 'Password changed successfully'
												});
											}
										});
									}
								});
							} else {
								res.status(400).send({
									message: 'Passwords do not match'
								});
							}
						} else {
							res.status(400).send({
								message: 'Current password is incorrect'
							});
						}
					})
				} else {
					res.status(400).send({
						message: 'User is not found'
					});
				}
			});
		} else {
			res.status(400).send({
				message: 'Please provide a new password'
			});
		}
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};
