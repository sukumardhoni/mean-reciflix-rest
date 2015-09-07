"use strict";

var _ = require('lodash'),
  config = require('../config/config'),
  nodemailer = require('nodemailer'),
  smtpTransport = require('nodemailer-smtp-transport'),
  EmailTemplate = require('email-templates').EmailTemplate,
  transporter = nodemailer.createTransport(smtpTransport(config.mailer.options));

exports.sendMail = function (mailData) {
  console.log('An email is being generated for mailData:' + JSON.stringify(mailData));

  var emailTemplate = new EmailTemplate(mailData.templateName);

  var mailOptions = {
    from: config.mailer.from, //'ReciFlix Support <support@reciflix.com>', // sender address
    secureConnection: false,
    to: mailData.to, // list of receivers
    subject: mailData.subject // Subject line
  };
  emailTemplate.render({
      displayName: mailData.displayName,
      email: mailData.to,
      userData:mailData.userData,
      resetUrl: mailData.url,
      appEnv: config.app.title
    },
    function (err, results) {
      if (err) {
        console.log('Failure to send recovery email, err is: ' + err);
      } else {
        mailOptions.html = results.html;
      }
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log('error in sending mail: ' + error);
        } else {
          console.log('Message sent: ' + info.response);
        }

      });
    });
}





/*exports.sendRecoveryLinkEmail = function (agenda) {
  agenda.define('Recovery_Link_Email', function (job, done) {
    console.log('Recovery_Link_Email  displayname: ' + job.attrs.data.displayName + ' , email: ' + job.attrs.data.email + ' , url: ' + job.attrs.data.url);




    var mailData = {};
    mailData.templateName = 'emailtemplates/recovery-email';
    mailData.to = job.attrs.data.email;
    mailData.subject = 'ReciFlix Password Reset';
    mailData.displayName = job.attrs.data.displayName;
    mailData.url = job.attrs.data.url;
    mailData.appEnv = config.app.title;

    reci_emailer.sendMail(mailData);


    //console.log('using the mailer options as : '+ JSON.stringify(config.mailer.options));
    var transporter = nodemailer.createTransport(smtpTransport(config.mailer.options));
    var templateDir = 'emailtemplates/recovery-email';
    var EmailTemplate = require('email-templates').EmailTemplate;
    var recoveryemail = new EmailTemplate(templateDir);

    var mailOptions = {
      from: 'ReciFlix Support <support@reciflix.com>', // sender address
      secureConnection: false,
      to: job.attrs.data.email, // list of receivers
      subject: 'ReciFlix Password Reset', // Subject line
    };
    recoveryemail.render({
        displayName: job.attrs.data.displayName,
        email: job.attrs.data.email,
        resetUrl: job.attrs.data.url,
        appEnv: config.app.title
      },
      function (err, results) {
        if (err) {
          console.log('Failure to send recovery email, err is: ' + err);
        } else {
          mailOptions.html = results.html;
        }

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log('error in sending mail: ' + error);
          } else {
            console.log('Message sent: ' + info.response);
          }

        });
      });
    done();
  })
}*/
