"use strict"
var _ = require('lodash'),
  mongoose = require('mongoose'),
  UsageDetails = mongoose.model('UsageDetails'),
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

exports.sendUserInfoToReciFlixTeam = function (agenda) {
  agenda.define('User_Info_To_ReciFlix_Team', function (job, done) {
    console.log('###user User_Info_To_ReciFlix_Team to the app, email: ' + JSON.stringify(job.attrs.data.userData));
    var mailData = {};
    mailData.templateName = 'emailtemplates/email-to-reciflix';
    mailData.to = 'support@reciflix.com';
    mailData.subject = 'New User To ReciFlix';
    mailData.userData = job.attrs.data.userData;
    mailData.appEnv = config.app.title;
   // console.log('Before sending to reciemail User_Info_To_ReciFlix_Team mailData: ' + JSON.stringify(mailData));
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


exports.saveUserUsageDetails = function (agenda) {
  agenda.define('User_Usage_Details', function (job, done) {

    //console.log('### User_Usage_Details save to collection : ' + JSON.stringify(job.attrs.data));
    //console.log('### User_Usage_Details user details : ' + JSON.stringify(req.user));

    var usageDetails = new UsageDetails(job.attrs.data);
    usageDetails.userId = job.attrs.data.userId;

    usageDetails.save(function (err) {
      if (err) {
        /*return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });*/
        console.log('Error while saving user usage details in agenda : ' + err);
        // done();
      } else {
        //res.json(category);
       // console.log('Successfully saved user usage details in agenda : ' + JSON.stringify(usageDetails));
        done();
      }
    });
  })
}
