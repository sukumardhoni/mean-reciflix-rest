'use strict';

var should = require('should'),
  request = require('supertest'),
  app = require('../../server'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  agent = request.agent(app);

/**
 * Globals
 */
var credentials, adminCredentials, user, adminUser, category;

/**
 * Article routes tests
 */
describe('User CRUD tests', function () {
  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
    };
    adminCredentials = {
      username: 'adminusername',
      password: 'adminpassword'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    adminUser = new User({
      firstName: 'AdminFull',
      lastName: 'AdminLastName',
      displayName: 'AdminFull Name',
      email: 'admin@test.com',
      username: adminCredentials.username,
      password: adminCredentials.password,
      provider: 'local',
      roles: ['user', 'admin']
    });

    /*		// Save a user to the test db and create new category
    		user.save(function () {

    		  //creating the admin user
    		  adminUser.save(function () {
    		    category = {
    		      catId: 'category1',
    		      displayName: 'Category 1'
    		    };

    		    done();
    		  });

    		});*/
  });
});
