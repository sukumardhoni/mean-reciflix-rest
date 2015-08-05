"use strict"
var Agenda = require("agenda");
var emailJob = require('./jobs/email-job.js');

module.exports = function (agendaDb) {
  var agenda = new Agenda({
    db: {
      address: agendaDb.uri
    }
  });
  emailJob.sendNewUserWelcomeEmail(agenda);
  emailJob.sendRecoveryLinkEmail(agenda);
  emailJob.sendPasswordChangedEmail(agenda);
  emailJob.sendUserSignin(agenda);
  agenda.start();
  return agenda;
}