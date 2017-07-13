'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  bcrypt = require('bcrypt-nodejs'),
  jwt = require('jwt-simple');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function (password) {
  return (this.provider !== 'local' || (password && password.length > 1));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your first name']
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your last name']
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your email'],
    match: [/.+\@.+\.+[a-zA-Z]{2,}/, 'Please fill a valid email address']
  },
  username: {
    type: String,
    unique: 'Username already exists',
    required: 'Please fill in a username',
    trim: true
  },
  password: {
    type: String,
    default: '',
    validate: [validateLocalStrategyPassword, 'Password should be longer']
  },
  fb_id: {
    type: String
  },
  favorites: [],
  subscription: [],
  likes: [],
  salt: {
    type: String
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerData: {},
  additionalProvidersData: {},
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin']
  }],
    default: ['user']
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  /* For reset password */
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  token: {
    type: String
  }
});

/**
 * Hook a pre save method to hash the password
 */
/*UserSchema.pre('save', function (next) {
	if (this.password && this.password.length > 6) {
		this.salt = crypto.randomBytes(16).toString('base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});*/

/**
 * Create instance method for hashing a password
 */
/*
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
	} else {
		return password;
	}
};
*/


// Execute before each user.save() call
UserSchema.pre('save', function (callback) {
  var user = this;
  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback();
  // Password changed so we need to hash it
  bcrypt.genSalt(5, function (err, salt) {
    if (err) return callback(err);
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});


UserSchema.methods.verifyPassword = function (password, cb) {
  console.log('verifyPassword in user model is called : ' + password);
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {

  //return this.password === this.hashPassword(password);

  /*  this.verifyPassword(password, function (err, isMatch) {
      console.log('Authentication in user model is called');
      if (isMatch) {
        console.log('Authentication in user model is TRUE');
        return true;
      } else {
        console.log('Authentication in user model is FALSE');
        return false;
      }
    });*/

  this.verifyPassword(password, function (err, isMatch) {
    var result = isMatch;
    console.log('Authentication in user model is :' + result);
    return isMatch;
  })





};

/**
 * Find possible not used username
 */

UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
  var _this = this;

  var possibleUsername = username + (suffix || '');

  _this.findOne({
    username: possibleUsername
  }, function (err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

mongoose.model('User', UserSchema);
