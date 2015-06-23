'use strict';

module.exports = {
  app: {
    title: 'ReciFlix, a mobile app to access, view and share best recipes online',
    description: 'Browse and view the best recipes on the online and favorite and share to spread the happiness',
    keywords: 'recipes, cooking, healthycooking, desserts, savouries, food, preparation'
  },
  port: process.env.PORT || 3000,
  templateEngine: 'swig',
  // The secret should be set to a non-guessable string that
  // is used to compute a session hash
  sessionSecret: 'MEAN',
  // The name of the MongoDB collection to store sessions in
  sessionCollection: 'sessions',
  // The session cookie settings
  sessionCookie: {
    path: '/',
    httpOnly: true,
    // If secure is set to true then it will cause the cookie to be set
    // only when SSL-enabled (HTTPS) is used, and otherwise it won't
    // set a cookie. 'true' is recommended yet it requires the above
    // mentioned pre-requisite.
    secure: false,
    // Only set the maxAge to null if the cookie shouldn't be expired
    // at all. The cookie will expunge when the browser is closed.
    maxAge: null,
    // To set the cookie in a specific domain uncomment the following
    // setting:
    // domain: 'yourdomain.com'
  },
  // The session cookie name
  sessionName: 'connect.sid',
  log: {
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'combined',
    // Stream defaults to process.stdout
    // Uncomment to enable logging to a log on the file system
    options: {
      stream: 'access.log'
    }
  },
  assets: {
    lib: {
      css: [
    'public/lib/bootstrap/dist/css/bootstrap.css',
    'public/lib/bootstrap/dist/css/bootstrap-theme.css',
    'public/lib/angular-ui-select/dist/select.css',
    'public/lib/select2/select2.css',
   ],
      js: [
    'public/lib/angular/angular.js',
    'public/lib/angular-resource/angular-resource.js',
    'public/lib/angular-animate/angular-animate.js',
    'public/lib/angular-ui-router/release/angular-ui-router.js',
    'public/lib/angular-ui-utils/ui-utils.js',
    'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
    'public/lib/jquery/dist/jquery.min.js',
    'public/lib/angular-ui-select/dist/select.js',
    'public/lib/select2/select2.js'

   ]
    },
    css: [
   'public/modules/**/css/*.css'
  ],
    js: [
   'public/config.js',
   'public/application.js',
   'public/modules/*/*.js',
   'public/modules/*/*[!tests]*/*.js'
  ],
    tests: [
   'public/lib/angular-mocks/angular-mocks.js',
   'public/modules/*/tests/*.js'
  ]
  }
};
