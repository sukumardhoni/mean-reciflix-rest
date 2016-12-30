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
  emailJob.sendUserInfoToReciFlixTeam(agenda);
  emailJob.sendUserSuggestionInfoToReciFlixTeam(agenda);
  emailJob.saveUserUsageDetails(agenda);
  emailJob.sendClientInfoToGTM(agenda);
  emailJob.sendEmailToRestaurant(agenda);
  emailJob.sendNewUserHairMovement(agenda);
  agenda.start();
  return agenda;
}
