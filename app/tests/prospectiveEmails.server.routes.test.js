'use strict';

var should = require('should'),
  request = require('supertest'),
  app = require('../../server'),
  mongoose = require('mongoose'),
  ProspectiveEmail = mongoose.model('ProspectiveEmail'),
  agent = request.agent(app);

/**
 * Globals
 */
var prospectiveEmail1,prospectiveEmail2;

/**
 * Article routes tests
 */
describe('prospectiveEmail CRUD tests', function () {
  beforeEach(function (done) {
    // Create user credentials

     prospectiveEmail1 = {
       platform: 'android',
      email:'www.@gmail.com'
    };

    prospectiveEmail2 = {
       platform: 'ios',
      email:'sss.@gmail.com'
    };

    done();
  });




  it('should be able to add a prospectiveEmail', function (done) {
    agent.post('/ProspectiveEmails')
      .send(prospectiveEmail1)
      .set('Accept', 'application/json')
      .expect(200)
       .end(function (emailGetErr, emailRes) {
            (emailRes.body.platform).should.equal(prospectiveEmail1.platform);
            (emailRes.body.email).should.equal(prospectiveEmail1.email);

            done();
          });
  });


 it('should fail attempt to retrive a prospectiveEmail by wrong  android', function (done) {
    agent.post('/ProspectiveEmails')
      .send(prospectiveEmail1)
      .set('Accept', 'application/json')
      .expect(200)

      .end(function (emailGetErr, emailRes) {
      agent.get('/ProspectiveEmails/android')
      .expect(400)
      .end(function (err, res) {

       res.body.should.be.an.Array.with.lengthOf(1);
        done();
      });


          });

  });


  it('should fail attempt to retrive a prospectiveEmail by wrong  android', function (done) {
    agent.post('/ProspectiveEmails')
      .send(prospectiveEmail2)
      .set('Accept', 'application/json')
      .expect(200)

      .end(function (emailGetErr, emailRes) {
      agent.get('/ProspectiveEmails/ios')
      .expect(400)
      .end(function (err, res) {

       res.body.should.be.an.Array.with.lengthOf(1);
        done();
      });


          });

  });





  afterEach(function (done) {
    ProspectiveEmail.remove().exec(done);
  });


});
