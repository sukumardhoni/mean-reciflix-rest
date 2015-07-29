"use strict"
var _ = require('lodash'),
  config = require('../../config/config'),
  reci_emailer = require('../../schedules/reci-emailer.js');

exports.sendNewUserWelcomeEmail = function (agenda) {
  agenda.define('New_User_Welcome', function (job, done) {
    var mailData = {};
    mailData.templateName = 'emailtemplates/welcome-email';
    mailData.to = job.attrs.data.email;
    mailData.subject = 'Welcome to ReciFlix';
    mailData.displayName = job.attrs.data.displayName;
    mailData.appEnv = config.app.title;
    reci_emailer.sendMail(mailData);
    done();
  })
}

exports.sendUserSignin = function (agenda) {
  agenda.define('User_Signedin', function (job, done) {
    console.log('###user SIGNIN to the app, email: ' + JSON.stringify(job.attrs.data));
    //shall add the functionality here if more required
    done();
  })
}

exports.sendRecoveryLinkEmail = function (agenda) {
  agenda.define('Recovery_Link_Email', function (job, done) {
    var mailData = {};
    mailData.templateName = 'emailtemplates/recovery-email';
    mailData.to = job.attrs.data.email;
    mailData.subject = 'ReciFlix Password Reset';
    mailData.displayName = job.attrs.data.displayName;
    mailData.url = job.attrs.data.url;
    mailData.appEnv = config.app.title;
    reci_emailer.sendMail(mailData);
    done();
  })
}

exports.sendPasswordChangedEmail = function (agenda) {
  agenda.define('Password_Changed_Email', function (job, done) {
    var mailData = {};
    mailData.templateName = 'emailtemplates/password-changed-email';
    mailData.to = job.attrs.data.email;
    mailData.subject = 'ReciFlix Password Successfully Changed';
    mailData.displayName = job.attrs.data.displayName;
    mailData.appEnv = config.app.title;
    reci_emailer.sendMail(mailData);
    done();
  })
}
