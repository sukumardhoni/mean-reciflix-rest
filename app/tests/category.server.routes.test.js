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
var credentials, adminCredentials, user, adminUser, category;

/**
 * Article routes tests
 */
describe('Category CRUD tests', function () {
  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      email: 'test@test.com',
      password: 'password'
    };
    adminCredentials = {
      email: 'admin@test.com',
      password: 'adminpassword'
    };


    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: credentials.email,
      password: credentials.password,
      provider: 'local'
    });

    adminUser = new User({
      firstName: 'AdminFull',
      lastName: 'AdminLastName',
      displayName: 'AdminFull Name',
      email: adminCredentials.email,
      password: adminCredentials.password,
      provider: 'local',
      roles: ['user', 'admin']
    });

    // Save a user to the test db and create new category
    user.save(function () {

      //creating the admin user
      adminUser.save(function () {
        category = {
          catId: 'category1',
          displayName: 'Category 1'
        };

        done();
      });

    });
  });

  it('should be able to save a category if logged in', function (done) {
    agent.post('/users/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);

        // Get the userId
        var userId = user.id;
        console.log("##############  signinRes is: " + JSON.stringify(signinRes.body));

        // Save a new category
        agent.post('/categories/0')
          .set('Accept', 'application/json')
          .send(category)
          .expect(200)
          .end(function (categorySaveErr, categorySaveRes) {
            // Handle category save error
            if (categorySaveErr) done(categorySaveErr);

            // Get a list of categories
            agent.get('/categories')
              .end(function (categoriesGetErr, categoriesGetRes) {
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


  it('should not be able to save a category if not logged in', function (done) {
    agent.post('/categories')
      .send(category)
      .expect(401)
      .end(function (categorySaveErr, categorySaveRes) {
        // Call the assertion callback
        done(categorySaveErr);
      });
  });

  it('should not be able to save a category if no catId is provided', function (done) {
    // Invalidate title field
    category.catId = '';

    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);

        // Get the userId
        var userId = user.id;

        // Save a new category
        agent.post('/categories')
          .send(category)
          .expect(400)
          .end(function (categorySaveErr, categorySaveRes) {

            // Set message assertion
            (categorySaveRes.body.message).should.match('catId cannot be blank');

            // Handle category save error
            done(categorySaveErr);
          });
      });
  });

  it('should be NOT able to update a category if a basic user signed in', function (done) {
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);

        // Get the userId
        var userId = user.id;

        // Save a new article
        agent.post('/categories')
          .send(category)
          .expect(200)
          .end(function (categorySaveErr, categorySaveRes) {
            // Handle category save error
            if (categorySaveErr) done(categorySaveErr);

            // Update article title
            category.catId = 'category2';

            // Update an existing article
            agent.put('/categories/' + categorySaveRes.body._id)
              .send(category)
              .expect(403)
              .end(function (categoryUpdateErr, categoryUpdateRes) {
                done();
              });
          });
      });
  });


  it('should be able to update a category if an admin user signed in', function (done) {
    agent.post('/auth/signin')
      .send(adminCredentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);

        // Get the userId
        var userId = adminUser.id;

        // Save a new article
        agent.post('/categories')
          .send(category)
          .expect(200)
          .end(function (categorySaveErr, categorySaveRes) {
            // Handle category save error
            if (categorySaveErr) done(categorySaveErr);

            // Update Category title
            category.catId = 'category2';

            // Update an existing article
            agent.put('/categories/' + categorySaveRes.body._id)
              .send(category)
              .expect(200)
              .end(function (categoryUpdateErr, categoryUpdateRes) {
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


  it('should be able to get a list of categories if not signed in', function (done) {
    // Create new category model instance
    var categoryObj = new Category(category);

    // Save the category
    categoryObj.save(function () {
      // Request categories
      request(app).get('/categories')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.an.Array.with.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });


  it('should be able to get a single category if not signed in', function (done) {

    // Create new category model instance
    var categoryObj = new Category(category);

    // Save the category
    categoryObj.save(function () {
      request(app).get('/categories/' + categoryObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.an.Object.with.property('catId', category.catId);
          res.body.should.be.an.Object.with.property('displayName', category.displayName);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single category which doesnt exist, if not signed in', function (done) {
    request(app).get('/categories/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.an.Object.with.property('message', 'Category is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should NOT be able to delete a category if basic user signed in', function (done) {
    agent.post('/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);

        // Get the userId
        var userId = user.id;

        // Save a new article
        agent.post('/categories')
          .send(category)
          .expect(200)
          .end(function (categorySaveErr, categorySaveRes) {
            // Handle category save error
            if (categorySaveErr) done(categorySaveErr);

            // Delete an existing category
            agent.delete('/categories/' + categorySaveRes.body._id)
              .send(category)
              .expect(403)
              .end(function (categoryDeleteErr, categoryDeleteRes) {
                // console.log("categoryDeleteErr : " + categoryDeleteErr);
                // console.log("categoryDeleteRes.body : " + JSON.stringify(categoryDeleteRes.body));

                // Handle category error error
                if (categoryDeleteErr) done(categoryDeleteErr);

                // Set assertions
                (categoryDeleteRes.body.message).should.equal('User does not have admin privelages');

                // Call the assertion callback
                done();
              });
          });
      });
  });
  it('should be able to delete a category if admin user signed in', function (done) {
    agent.post('/auth/signin')
      .send(adminCredentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);

        // Get the userId
        var userId = adminUser.id;

        // Save a new article
        agent.post('/categories')
          .send(category)
          .expect(200)
          .end(function (categorySaveErr, categorySaveRes) {
            // Handle category save error
            if (categorySaveErr) done(categorySaveErr);

            // Delete an existing category
            agent.delete('/categories/' + categorySaveRes.body._id)
              .send(category)
              .expect(200)
              .end(function (categoryDeleteErr, categoryDeleteRes) {
                // Handle category error error
                if (categoryDeleteErr) done(categoryDeleteErr);

                // Set assertions
                (categoryDeleteRes.body._id).should.equal(categorySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete a category if not signed in', function (done) {
    // Set category user
    category.user = user;

    // Create new category model instance
    var categoryObj = new Category(category);

    // Save the category
    categoryObj.save(function () {
      // Try deleting category
      request(app).delete('/categories/' + categoryObj._id)
        .expect(401)
        .end(function (categoryDeleteErr, categoryDeleteRes) {
          // Set message assertion
          (categoryDeleteRes.body.message).should.match('User is not logged in');

          // Handle article error error
          done(categoryDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Category.remove().exec(done);
    });
  });
});
