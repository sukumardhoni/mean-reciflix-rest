'use strict';

/**
 * Module dependencies.
 */
var ProspectiveEmail = require('../../app/controllers/ProspectiveEmails.server.controller');


module.exports = function (app) {

  app.route('/ProspectiveEmails')
    .post(ProspectiveEmail.create);

  app.route('/ProspectiveEmails/list')
    .get(ProspectiveEmail.list);

  app.route('/ProspectiveEmails/count/:platform')
    .get(ProspectiveEmail.count);



  app.route('/gtm-contact-email')
    .post(ProspectiveEmail.gtmEmail);




};
