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
      userData: mailData.userData,
      resetUrl: mailData.url,
      appEnv: mailData.appEnv ? mailData.appEnv : config.app.title,
      orderData: mailData.orderData,
      orderDetails: mailData.orderDetails,
      tipAmount: mailData.tipAmount,
      foodTax: mailData.foodTax,
      subTotalPrice: mailData.subTotalPrice,
      totalAmt: mailData.totalAmt,
      userDetails: mailData.user
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



exports.sendSalonMail = function (mailData) {
  console.log('An email is being generated for mailData:' + JSON.stringify(mailData));

  var emailTemplate = new EmailTemplate(mailData.templateName);

  var mailOptions = {
    from: config.salon_mailer.hairmovement.auth.user, //'ReciFlix Support <support@reciflix.com>', // sender address
    secureConnection: false,
    to: mailData.to, // list of receivers
    subject: mailData.subject // Subject line
  };
  emailTemplate.render({
      email: mailData.to,
      userDetails: mailData.user
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





exports.sendRestaurantMail = function (mailData) {
  console.log('An email is being generated for mailData:' + JSON.stringify(mailData));
  console.log('Which restaurant :' + config.restaurant_mailer[mailData.restId].auth.user);

  var emailTemplate = new EmailTemplate(mailData.templateName);

  var mailOptions = {
    from: config.restaurant_mailer[mailData.restId].auth.user, //'ReciFlix Support <support@reciflix.com>', // sender address
    secureConnection: false,
    to: mailData.to, // list of receivers
    bcc: 'support@reciflix.com',
    subject: mailData.subject // Subject line
  };
  emailTemplate.render({
      email: mailData.to,
      restDisplayName: mailData.restDisplayName,
      formatedOrderTime: mailData.formatedOrderTime,
      orderData: mailData.orderData,
      orderDetails: mailData.orderDetails,
      tipAmount: mailData.tipAmount,
      foodTax: mailData.foodTax,
      subTotalPrice: mailData.subTotalPrice,
      totalAmt: mailData.totalAmt
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
