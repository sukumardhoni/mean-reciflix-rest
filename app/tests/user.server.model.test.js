'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * Globals
 */
var user, user2, adminuser1;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password',
      provider: 'local',
      favorites: ['vid1', 'vid2']
    });
    user2 = new User({
      firstName: 'Full1',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password',
      provider: 'local',
      favorites: ['vid2222', 'vid333']
    });
    adminuser1 = new User({
      firstName: 'adminFull1',
      lastName: 'adminLastName',
      displayName: 'AdminFull Name',
      email: 'test2@test2.com',
      username: 'adminuser1',
      password: 'password',
      provider: 'local',
      roles: ['user', 'admin'],
      favorites: ['vid2222', 'vid333']
    });
    done();
  });


  describe('Method Save', function () {
    it('should begin with no users', function (done) {
      User.find({}, function (err, users) {
        users.should.have.length(0);
        done();
      });
    });

    it('should be able to save without problems', function (done) {
      //user.save(done);
      user.save(function () {
        User.find({}, function (err, users) {
          users.should.have.length(1);
          users[0].should.have.property('roles').with.lengthOf(1);
          users[0].roles.should.have.property(0, 'user');
          users[0].should.have.property('firstName', 'Full');
          users[0].should.have.property('favorites').with.lengthOf(2);
        });
        done();
      });
    });

    it('should fail to save an existing user again', function (done) {
      user.save(function () {
        user2.save(function (err) {
          should.exist(err);
          done();
        });
      });
    });

    it('should be able to show an error when try to save without first name', function (done) {
      user.firstName = '';
      return user.save(function (err) {
        should.exist(err);
        done();
      });
    });


    it('should be able to save a admin user without problems', function (done) {
      adminuser1.save(
        function () {
          User.find({}, function (err, users) {
            users.should.have.length(1);
            users[0].should.have.property('roles').with.lengthOf(2);
            users[0].roles.should.have.property(0, 'user');
            users[0].roles.should.have.property(1, 'admin');
            done();
          });

        });
    });

  });

  afterEach(function (done) {
    User.remove().exec(done);
  });
});
