'use strict';

module.exports = {
  db: {
    uri: process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/recflixdev',
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
        'public/lib/bootstrap/dist/css/bootstrap.css',
    'public/lib/metisMenu/dist/metisMenu.min.css',
    'public/lib/fontawesome/css/font-awesome.min.css'
   ],
      js: [
    'public/lib/jquery/dist/jquery.min.js',
    'public/lib/bootstrap/dist/js/bootstrap.min.js',
    'public/lib/metisMenu/dist/metisMenu.min.js',
    'public/lib/PACE/pace.min.js',
    'public/scripts.js',
    'public/lib/angular/angular.js',
    'public/lib/angular-resource/angular-resource.js',
    'public/lib/angular-cookies/angular-cookies.js',
    'public/lib/angular-animate/angular-animate.js',
    'public/lib/angular-touch/angular-touch.js',
    'public/lib/angular-sanitize/angular-sanitize.js',
    'public/lib/angular-ui-router/release/angular-ui-router.js',
    'public/lib/angular-ui-utils/ui-utils.js',
    'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
    'public/lib/ngstorage/ngStorage.js',
    'public/lib/toastr/toastr.js',
    'public/lib/jquery-ui/jquery-ui.min.js',
    'public/lib/slimScroll/jquery.slimscroll.min.js',
    'public/lib/numeral/min/numeral.min.js'
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
    from: process.env.MAILER_FROM || 'ReciFlix Support <support@reciflix.com>',
    options: {
      host: 'reciflix.com',
      port: 25,
      tls: {
        rejectUnauthorized: false
      },
      auth: {
        user: 'support@reciflix.com',
        pass: 'gtmsupport123'
      }
    }
  }
};
