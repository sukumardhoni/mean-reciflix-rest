'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('../errors.server.controller'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User'),
  jwt = require('jwt-simple');

/*JWT Signup*/
exports.jwtSignup = function (req, res, next) {
  //console.log('JWT Signup')
  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) {
      res.json({
        type: false,
        data: 'Error occured: ' + err
      });
    } else {
      if (user) {
        //console.log('User already exists : ' + JSON.stringify(user));
        if (user.token === '') {
          var secret = 'www';
          var payload = {
            email: req.body.email
          };
          var token = jwt.encode(payload, secret);
          user.token = token;
          user.save(function (err) {
            if (err) {
              //console.log('Error occured on singin function is : ' + err);
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              req.login(user, function (err) {
                if (err) {
                  res.status(400).send(err);
                } else {
                  //res.jsonp(user);
                  res.json({
                    type: false,
                    data: 'User already exists!11',
                    user: user
                  });
                  //console.log('@@@@@@ Found user in signin  func.  @@@@@@@' + JSON.stringify(user));
                }
              });
            }
          });
        } else {
          res.json({
            type: false,
            data: 'User already exists!222',
            user: user
          });
        }
      } else {
        //delete req.body.roles;
        var userModel = new User(req.body);
        userModel.provider = req.body.provider || 'local';
        userModel.displayName = userModel.firstName + ' ' + userModel.lastName;
        userModel.username = userModel.email;
        var secret = 'www';
        var payload = {
          email: req.body.email
        };
        var jwtToken = jwt.encode(payload, secret);
        userModel.token = jwtToken;
        userModel.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            req.login(userModel, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.jsonp(userModel);
              }
            });
          }
        });
      }
    }
  });
};


/* JWT Signin*/

exports.jwtSignin = function (req, res, next) {
  //console.log('jwtSignin');
  //console.log('@@@@@@ JWt server side signin   @@@@@@@' + JSON.stringify(req.body));
  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) {
      console.log('error :' + err);
      res.json({
        type: false,
        data: 'Error occured: ' + err
      });
    } else {
      if (user) {
        var password = req.body.password;
        // Make sure the password is correct
        user.verifyPassword(password, function (err, isMatch) {
          if (isMatch) {
            // Success
            var secret = 'www';
            var payload = {
              email: req.body.email
            };
            var token = jwt.encode(payload, secret);
            user.token = token;
            user.password = req.body.password;
            user.save(function (err) {
              if (err) {
                //console.log('Error occured on singin function is : ' + err);
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                req.login(user, function (err) {
                  if (err) {
                    res.status(400).send(err);
                  } else {
                    res.jsonp(user);
                    //console.log('@@@@@@ Found user in signin  func.  @@@@@@@' + JSON.stringify(user));
                  }
                });
              }
            });
          } else {
            res.json({
              type: false,
              data: 'Incorrect password'
            });
          }
        });
      } else {
        res.json({
          type: false,
          data: 'Incorrect user/password'
        });
      }
    }
  });
};

/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init Variables
  var user = new User(req.body);
  var message = null;

  // Add missing user fields
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;

  // Then save the user
  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  });
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};



exports.jwtSignout = function (req, res, next) {
  var bearerToken;
  var bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(' ');
    if (bearer[1] === 'undefined') {
      res.sendStatus(401);
    } else {
      bearerToken = bearer[1];
      User.findOne({
        token: bearerToken
      }, function (err, user) {
        if (err) {
          res.json({
            type: false,
            data: 'Error occured: ' + err
          });
        } else if (user === null) {
          res.json({
            type: false,
            data: 'Empty User Occured '
          });
        } else {
          user.token = '';
          user.save(function (err) {
            if (err) {
              //console.log('Error occured on singout function is : ' + err);
              res.status(400).send(err);
            } else {
              req.logout();
              res.status(200).send({
                type: true,
                data: 'User is susccessfully logged out'
              });
            }
          });
        }
      });
    }
  } else {
    res.sendStatus(401);
  }
};



/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {
    passport.authenticate(strategy, function (err, user, redirectURL) {
      if (err || !user) {
        return res.redirect('/#!/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/#!/signin');
        }

        return res.redirect(redirectURL || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // And save the user
            user.save(function (err) {
              return done(err, user);
            });
          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) user.additionalProvidersData = {};
      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, '/#!/settings/accounts');
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.param('provider');

  if (user && provider) {
    // Delete the additional provider
    if (user.additionalProvidersData[provider]) {
      delete user.additionalProvidersData[provider];

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');
    }

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
  }
};
