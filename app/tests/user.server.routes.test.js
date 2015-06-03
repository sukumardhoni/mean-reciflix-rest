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
var credentials, adminCredentials, user, adminUser;

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

    done();
  });


  it('should be able to signup a User successfully', function (done) {
    agent.post('/users/signup')
      .send(user)
      .expect(200)
      .end(function (signupErr, signupRes) {
        // Handle signin error
        if (signupErr) done(signupErr);
        // Get the userId
        var userId = user.id;
        var userToken = signupRes.body.token;
        agent.get('/users/me')
          .send(credentials)
          .expect(200)
          .end(function (userGetErr, userRes) {
            (userRes.body._id).should.equal(userId);
            (userRes.body.email).should.equal(user.email);
            (userRes.body.token).should.equal(userToken);
            (userRes.body.roles).should.have.length(1);
            (userRes.body.roles).should.have.property(0, 'user');
            done();
          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(done);
  });


});
