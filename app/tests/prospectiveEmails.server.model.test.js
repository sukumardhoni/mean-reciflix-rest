'use strict';

/**
 * Module dependencies.
 */
var supertest = require('supertest'),
  /*jshint -W079 */
  expect = require('chai').expect,
  mongoose = require('mongoose'),
  ProspectiveEmail = mongoose.model('ProspectiveEmail'),
  api = supertest('http://localhost:3001');

/**
 * Globals
 */
var prospectiveEmails1,prospectiveEmails2,prospectiveEmails3;
describe('ProspectiveEmail Model Unit Tests:', function () {
  beforeEach(function (done) {
    prospectiveEmails1 = new ProspectiveEmail({
      platform: 'android',
      email:'www.@gmail.com'
    });
    prospectiveEmails2 = new ProspectiveEmail({
      platform: 'android',
      email:'yyy.@gmail.com'
    });
    prospectiveEmails3 = new ProspectiveEmail({
      platform: 'ios',
      email:'sss.@gmail.com'
    });
    done();
  });


  describe('Method Save', function () {
    it('should begin with no ProspectiveEmail', function (done) {
      ProspectiveEmail.find({}, function (err, emails) {
        emails.should.have.length(0);
        done();
      });
    });

    it('should be able to save a prospectiveEmails  without android', function (done) {
      //user.save(done);
      prospectiveEmails1.save(function () {
        ProspectiveEmail.find({}, function (err, emails) {
          emails.should.have.length(1);


          emails[0].should.have.property('platform', 'android');
         emails[0].should.have.property('email', 'www.@gmail.com');
        });
        done();
      });
    });




    it('should be able to save a prospectiveEmails  without ios', function (done) {
      prospectiveEmails3.save(
        function () {
          ProspectiveEmail.find({}, function (err, emails) {
            emails.should.have.length(1);

            emails[0].should.have.property('platform', 'ios');
         emails[0].should.have.property('email', 'sss.@gmail.com');
            done();
          });

        });
    });

  });

  afterEach(function (done) {
    ProspectiveEmail.remove().exec(done);
  });
});
