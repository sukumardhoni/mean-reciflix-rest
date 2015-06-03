'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Category = mongoose.model('Category');

/**
 * Globals
 */
var user, category;

/**
 * Unit tests
 */
describe('Category Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      password: 'password'
    });

    user.save(function () {
      category = new Category({
        catId: 'cat1',
        displayName: 'Category 1',
        imageName: 'cat1.png',
        description: 'Description for cat1',
        user: user
      });
      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      // console.log('Category is: '+ category);
      return category.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without catid', function (done) {
      category.catId = '';

      return category.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without displayName', function (done) {
      category.displayName = '';

      return category.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to save without imageName', function (done) {
      category.imageName = '';
      return category.save(function (err, category) {
        // console.log('category: ' + category);
        should.not.exist(err);
        done();
      });
    });

    it('should be able to save default value N for status', function (done) {
      return category.save(function (err, category) {
        should.not.exist(err);
        should(category.status).be.equal('N');
        done();
      });
    });
  });


  afterEach(function (done) {
    Category.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
