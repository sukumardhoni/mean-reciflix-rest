"use strict"
var _ = require('lodash'),
config = require('../../config/config'),
  nodemailer = require('nodemailer'),
  smtpTransport = require('nodemailer-smtp-transport');

exports.sendNewUserWelcomeEmail = function (agenda) {
  agenda.define('New_User_Welcome', function (job, done) {
    console.log('New user welcome mail  firstname: ' +job.attrs.data.firstName+' , email: ' +job.attrs.data.email);
    //console.log('using the mailer options as : '+ JSON.stringify(config.mailer.options));
    var transporter = nodemailer.createTransport(smtpTransport(config.mailer.options));
    var templateDir   = 'emailtemplates/welcome-email';
    var EmailTemplate = require('email-templates').EmailTemplate;
    var welcomeemail = new EmailTemplate(templateDir);

    var mailOptions = {
      from: 'ReciFlix Support <support@reciflix.com>', // sender address
      secureConnection: false,
      to: job.attrs.data.email, // list of receivers
      subject: 'Welcome to ReciFlix', // Subject line
    };

    welcomeemail.render(
          {firstName:job.attrs.data.firstName, email:job.attrs.data.email},
          function (err, results) {
      if(err){
        console.log('Failure to send email, err is: '+ err);
      }else{
        mailOptions.html=results.html;
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
}

exports.sendUserSignin = function (agenda) {
  agenda.define('User_Signedin', function (job, done) {
    console.log('###user SIGNIN to the app, email: ' + JSON.stringify(job.attrs.data));
    //shall add the functionality here if more required
    done();
  })
}
