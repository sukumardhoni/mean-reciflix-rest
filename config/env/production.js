'use strict';

module.exports = {
  db: {
    uri: process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/mean',
    options: {
      user: '',
      pass: ''
    }
  },
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
    'public/lib/bootstrap/dist/css/bootstrap.min.css',
    'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
    'public/lib/angular-ui-select/dist/select.min.css',
    'public/lib/select2/select2.css'
   ],
      js: [
    'public/lib/angular/angular.min.js',
    'public/lib/angular-resource/angular-resource.min.js',
    'public/lib/angular-animate/angular-animate.min.js',
    'public/lib/angular-ui-router/release/angular-ui-router.min.js',
    'public/lib/angular-ui-utils/ui-utils.min.js',
    'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
    'public/lib/jquery/dist/jquery.min.js',
    'public/lib/angular-ui-select/dist/select.min.js',
    'public/lib/ngstorage/ngStorage.min.js'
   ]
    },
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '1607966326154856',
    clientSecret: process.env.FACEBOOK_SECRET || '27248d18a667ceee9ba840ed21bab6cb',
    callbackURL: '/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/auth/github/callback'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'ReciFlix Admin',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'gtmdevenv@gmail.com',
        pass: process.env.MAILER_PASSWORD || 'testdev1'
      }
    }
  }
};
