'use strict';

/**
 * Module dependencies.
 */
var ProspectiveEmail = require('../../app/controllers/ProspectiveEmails.server.controller');


module.exports = function (app) {

 app.route('/ProspectiveEmails')
      .post(ProspectiveEmail.create);

  app.route('/ProspectiveEmails/:platform')
    .get(ProspectiveEmail.list)

};
