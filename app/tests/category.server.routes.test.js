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
    // Create user credentials object
    credentials = {
      email: 'test@test.com',
      password: 'password'
    };
    // Create admin credentials object
    adminCredentials = {
      email: 'admin@test.com',
      password: 'adminpassword'
    };

    // Create a new basic user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: credentials.email,
      username: credentials.email,
      password: credentials.password,
      provider: 'local'
    });

    //Create a new admin user
    adminUser = new User({
      firstName: 'AdminFull',
      lastName: 'AdminLastName',
      displayName: 'AdminFull Name',
      email: adminCredentials.email,
      username: adminCredentials.email,
      password: adminCredentials.password,
      provider: 'local',
      roles: ['user', 'admin']
    });

    user.save(function (err) {
      if (err) done(err);
      adminUser.save(function (err) {
        if (err) done(err);

        //prepare category object
        category = {
          catId: 'category1',
          displayName: 'Category 1'
        };
        done();
      });
    });

  });

  it('should be NOT able to create a category if basic user is logged in', function (done) {
    agent.post('/users/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);
        // Get the userId
        var userId = signinRes.body._id;
        var token = signinRes.body.token;
        //console.log('user sign in and token is: ' + token);        // Save a new category
        agent.post('/categories')
          .set('Accept', 'application/json')
          .set('Authorization', 'Basic ' + token)
          .send(category)
          .expect(401);
        done();

      });
  });



  it('should be able to create a category if ADMIN user is logged in', function (done) {
    agent.post('/users/signin')
      .send(adminCredentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);
        // Get the userId
        var userId = signinRes.body._id;
        var token = signinRes.body.token;
        //console.log('user sign in and token is: ' + token);        // Save a new category
        agent.post('/categories')
          .set('Accept', 'application/json')
          .set('Authorization', 'Basic ' + token)
          .send(category)
          .expect(200)
          .end(function (categorySaveErr, categorySaveRes) {
            // Handle category save error
            if (categorySaveErr) done(categorySaveErr);
            // Get a list of categories
            agent.get('/categories/page/0')
              .set('Authorization', 'Basic ' + token)
              .end(function (categoriesGetErr, categoriesGetRes) {

                // Handle categories save error
                if (categoriesGetErr) done(categoriesGetErr);


                // Get categories list
                var categories = categoriesGetRes.body;
                //                console.log('categories fetched : ' + JSON.stringify(categories));

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

    agent.post('/users/signin')
      .send(adminCredentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);

        // Get the userId
        var userId = user.id;
        var token = signinRes.body.token;

        // Save a new category
        agent.post('/categories')
          .set('Authorization', 'Basic ' + token)
          .send(category)
          .expect(400)
          .end(function (categorySaveErr, categorySaveRes) {
            if (categorySaveErr) done(categorySaveErr);

            // Set message assertion
            (categorySaveRes.body.message).should.match('catId cannot be blank');

            done();
          });
      });
  });


  it('should be able to update a category if an admin user signed in', function (done) {

    agent.post('/users/signin')
      .send(adminCredentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);

        // Get the userId
        var userId = adminUser.id;
        var token = signinRes.body.token;

        // Save a new article
        agent.post('/categories')
          .set('Authorization', 'Basic ' + token)
          .send(category)
          .expect(200)
          .end(function (categorySaveErr, categorySaveRes) {
            // Handle category save error
            if (categorySaveErr) done(categorySaveErr);

            // Update Category title
            category.catId = 'category2';

            // Update an existing article
            agent.put('/categories/' + categorySaveRes.body._id)
              .set('Authorization', 'Basic ' + token)
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
      request(app).get('/categories/page/0')
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
    agent.post('/users/signin')
      .send(adminCredentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);
        var token = signinRes.body.token;
        // Save a new article
        agent.post('/categories')
          .set('Authorization', 'Basic ' + token)
          .send(category)
          .expect(200)
          .end(function (categorySaveErr, categorySaveRes) {
            // Handle category save error
            if (categorySaveErr) done(categorySaveErr);
            agent.post('/users/signout')
              .set('Authorization', 'Basic ' + token)
              .expect(200)
              .end(function (logoutErr, logoutRes) {

                agent.post('/users/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) done(signinErr);
                    var usertoken = signinRes.body.token;
                    // Delete an existing category
                    agent.delete('/categories/' + categorySaveRes.body._id)
                      .set('Authorization', 'Basic ' + usertoken)
                      .expect(401)
                      .end(function (delErr, delRes) {
                        if (delErr) done(delErr);
                        done();
                      });
                  });

              });
          });
      });
  });

  it('should be able to delete a category if ADMIN user signed in', function (done) {
    agent.post('/users/signin')
      .send(adminCredentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) done(signinErr);
        var token = signinRes.body.token;

        // Save a new article
        agent.post('/categories')
          .set('Authorization', 'Basic ' + token)
          .send(category)
          .expect(200)
          .end(function (categorySaveErr, categorySaveRes) {
            // Handle category save error
            if (categorySaveErr) done(categorySaveErr);
            // Delete an existing category
            agent.delete('/categories/' + categorySaveRes.body._id)
              .set('Authorization', 'Basic ' + token)
              .expect(200)
              .end(function (delErr, delRes) {
                // Handle category save error
                if (delErr) done(delErr);
                console.log('delRes : ' + JSON.stringify(delRes.body));
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    Category.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
