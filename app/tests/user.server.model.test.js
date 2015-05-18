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
var user, user2;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {
	before(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local',
			favorites:['vid1','vid2']
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

		done();
	});


	describe('Method Save', function() {
		it('should begin with no users', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			user.save(done);
		});

        it('after one save the user shall be one', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(1);
				done();
			});
		});

		it('after one save favourites tes', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(1);
				users[0].should.have.property('firstName', 'Full');
				users[0].should.have.property('favorites').with.lengthOf(2);
				done();
			});
		});



		it('should fail to save an existing user again', function(done) {
			user.save(function() {
				user2.save(function(err) {
					should.exist(err);
					done();
				});	
			});
		});

		it('should be able to show an error when try to save without first name', function(done) {
			user.firstName = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	after(function(done) {
		User.remove().exec(done);
	});
});
