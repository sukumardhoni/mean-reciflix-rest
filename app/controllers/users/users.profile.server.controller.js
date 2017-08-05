'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('../errors.server.controller.js'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User');


exports.ensureAuthenticated = function (req, res, next) {
  console.log('### ensureAuthenticated is called');
  var bearerToken;
  var bearerHeader = req.headers.authorization;
  //console.log('bearerHeader---------' +JSON.stringify(req.headers.authorization));
  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(' ');
    if (bearer[1] === 'undefined') {
      res.sendStatus(401);
    } else {
      bearerToken = bearer[1];
      //req.token = bearerToken;
      //    console.log('Token fetched from client users is : ' + bearerToken);
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
          //console.log('user is Authenticated' );
          req.user = user;
          next();
        }
      });
    }
  } else {
    res.sendStatus(401);
  }
};

exports.checkingUser = function (req, res, next) {
  // console.log('checkingUser is called');
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

exports.checkAdmin = function (req, res, next) {
  //console.log('checking if User is Admin');
  var bearerToken;
  var bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(' ');
    if (bearer[1] === 'undefined') {
      res.sendStatus(401);
    } else {
      bearerToken = bearer[1];
      //console.log('Token fetched from header is : ' + bearerToken);
      User.findOne({
        token: bearerToken
      }, function (err, user) {
        if (err) {
          res.json({
            type: false,
            data: 'Error occured: ' + err
          });
        } else {
          //console.log('user is: ' + JSON.stringify(user));
          if (user.roles.indexOf('admin') > -1) {
            next();
          } else {
            res.status(401).send({
              type: false,
              data: 'User does not have Admin privelege'
            });
          }
        }
      });
    }
  } else {
    res.sendStatus(403);
  }

};



exports.totalUsers = function (req, res, next) {

  var CollectionObj = {};
  CollectionObj.users = [];



  var bearer = req.params.pageId.split('TUC');
  if (bearer[1] === '') {
    User.find().exec(function (err, users) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        CollectionObj.count = users.length;
        req.UsersCollectionObj = CollectionObj;
        console.log('### usersCount is total collection : ' + JSON.stringify(req.UsersCollectionObj));
        next();
        //res.json(users);
      }
    });
  } else {
    CollectionObj.count = bearer[1];
    req.UsersCollectionObj = CollectionObj;
    console.log('### usersCount is total collection : ' + JSON.stringify(req.UsersCollectionObj));
    next();
  };





};


exports.totalUsersByPageId = function (req, res) {
  var bearer = req.params.pageId.split('TUC');
  User.find().skip(bearer[0] * 5).limit(5).sort('-created').exec(function (err, users) {
    if (err) {
      // console.log('@@@@@@@@@ Error at categories list fetching : ' + err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log('@@@@@@@@@ Before details list  successfully fetched and req obj also : ' + JSON.stringify(req.UsersCollectionObj));
      var CollectionObj = req.UsersCollectionObj;
      CollectionObj.users = users;
      console.log('@@@@@@@@@ After details list  successfully fetched and req obj also : ' + JSON.stringify(CollectionObj));
      res.json(CollectionObj);
    }
  });
};



/* Update Favorities and Likes on User Profile */


exports.userFavorites = function (req, res) {
  //console.log('Update user fav video ids is called in server' + JSON.stringify(req.body));
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
    user.provider = req.body.provider || 'local';
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    return user.save(function (err, usercb) {
      if (err) {
        res.status(400).send(err);
        //console.log('Error on update fav vids into user : ' + err);
      } else {
        res.jsonp(usercb);
      }
    });
  });
};





/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;
  var message = null;
  console.log('req.user '+JSON.stringify(req.user))
  console.log('req.body -- '+JSON.stringify(req.body))
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;
delete req.body.__v;
  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    console.log('final user obj -- '+JSON.stringify(user))
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

  // console.log('call came into users.me, req.user is : ' + JSON.stringify(req.user));

  res.json(req.user || null);
};


//TODO yet to test this method, to be used for getting a full user after sign in
exports.fetchUser = function (req, res, next) {
  console.log('### ensureAuthenticated is called');
  var bearerToken;
  var bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(' ');
    if (bearer[1] === 'undefined') {
      res.sendStatus(401);
    } else {
      bearerToken = bearer[1];
      //req.token = bearerToken;
      //    console.log('Token fetched from client users is : ' + bearerToken);
      User.findOne({
        token: bearerToken
      }, function (err, user) {
        if (err) {
          res.json({
            type: false,
            data: 'Error occured: ' + err
          });
        } else {
          res.json(user);
        }
      });
    }
  } else {
    res.sendStatus(401);
  }
};
