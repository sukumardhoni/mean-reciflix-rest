'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Category = mongoose.model('Category'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, category;

/**
 * Article routes tests
 */
describe('Category CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
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

		// Save a user to the test db and create new article
		user.save(function() {
			category = {
				catId: 'category1',
				displayName: 'Category 1'
			};

			done();
		});
	});

	it('should be able to save a category if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new category
				agent.post('/categories')
					.send(category)
					.expect(200)
					.end(function(categorySaveErr, categorySaveRes) {
						// Handle category save error
						if (categorySaveErr) done(categorySaveErr);

						// Get a list of categories
						agent.get('/categories')
							.end(function(categoriesGetErr, categoriesGetRes) {
								// Handle categories save error
								if (categoriesGetErr) done(categoriesGetErr);

								// Get categories list
								var categories = categoriesGetRes.body;

								// Set assertions
								(categories[0].user._id).should.equal(userId);
								(categories[0].catId).should.match('category1');

								// Call the assertion callback
								done();
							});
					});
			});
	});


	it('should not be able to save a category if not logged in', function(done) {
		agent.post('/categories')
			.send(category)
			.expect(401)
			.end(function(categorySaveErr, categorySaveRes) {
				// Call the assertion callback
				done(categorySaveErr);
			});
	});

	it('should not be able to save a category if no catId is provided', function(done) {
		// Invalidate title field
		category.catId = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new category
				agent.post('/categories')
					.send(category)
					.expect(400)
					.end(function(categorySaveErr, categorySaveRes) {

						// Set message assertion
						(categorySaveRes.body.message).should.match('catId cannot be blank');

						// Handle category save error
						done(categorySaveErr);
					});
			});
	});

	it('should be able to update an category if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new article
				agent.post('/categories')
					.send(category)
					.expect(200)
					.end(function(categorySaveErr, categorySaveRes) {
						// Handle category save error
						if (categorySaveErr) done(categorySaveErr);

						// Update article title
						category.catId = 'category2';

						// Update an existing article
						agent.put('/categories/' + categorySaveRes.body._id)
							.send(category)
							.expect(200)
							.end(function(categoryUpdateErr, categoryUpdateRes) {
								// Handle category update error
								if (categoryUpdateErr) done(categoryUpdateErr);

								// Set assertions
								(categoryUpdateRes.body._id).should.equal(categorySaveRes.body._id);
								(categoryUpdateRes.body.catId).should.match('category2');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of categories if not signed in', function(done) {
		// Create new category model instance
		var categoryObj = new Category(category);

		// Save the category
		categoryObj.save(function() {
			// Request categories
			request(app).get('/categories')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});

/*
	it('should be able to get a single article if not signed in', function(done) {
		// Create new article model instance
		var articleObj = new Article(article);

		// Save the article
		articleObj.save(function() {
			request(app).get('/articles/' + articleObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', article.title);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should return proper error for single article which doesnt exist, if not signed in', function(done) {
		request(app).get('/articles/test')
			.end(function(req, res) {
				// Set assertion
				res.body.should.be.an.Object.with.property('message', 'Article is invalid');

				// Call the assertion callback
				done();
			});
	});

	it('should be able to delete an article if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new article
				agent.post('/articles')
					.send(article)
					.expect(200)
					.end(function(articleSaveErr, articleSaveRes) {
						// Handle article save error
						if (articleSaveErr) done(articleSaveErr);

						// Delete an existing article
						agent.delete('/articles/' + articleSaveRes.body._id)
							.send(article)
							.expect(200)
							.end(function(articleDeleteErr, articleDeleteRes) {
								// Handle article error error
								if (articleDeleteErr) done(articleDeleteErr);

								// Set assertions
								(articleDeleteRes.body._id).should.equal(articleSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an article if not signed in', function(done) {
		// Set article user
		article.user = user;

		// Create new article model instance
		var articleObj = new Article(article);

		// Save the article
		articleObj.save(function() {
			// Try deleting article
			request(app).delete('/articles/' + articleObj._id)
			.expect(401)
			.end(function(articleDeleteErr, articleDeleteRes) {
				// Set message assertion
				(articleDeleteRes.body.message).should.match('User is not logged in');

				// Handle article error error
				done(articleDeleteErr);
			});

		});
	});*/

	afterEach(function(done) {
		User.remove().exec(function() {
			Category.remove().exec(done);
		});
	});
});
