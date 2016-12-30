'use strict';

module.exports = {
  redis: {
    uri: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
  },
  port: 8443,
  db: {
    uri: process.env.MONGOLAB_URI || 'mongodb://localhost/recflixdev',
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
    'public/lib/fontawesome/css/font-awesome.min.css',
    'public/lib/toastr/toastr.min.css',
    'public/lib/angular-ui-select/dist/select.min.css',
    'public/lib/select2/select2.css'
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
    'public/lib/numeral/min/numeral.min.js',
    'public/lib/ng-file-upload/ng-file-upload-shim.min.js',
    'public/lib/ng-file-upload/ng-file-upload.min.js',
    'public/lib/angular-ui-select/dist/select.min.js',
    'public/lib/select2/select2.min.js',
    'public/lib/angular-update-meta/dist/update-meta.min.js',
    'public/lib/angular-socialshare/dist/angular-socialshare.min.js'
   ]
    },
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: 'https://localhost:443/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: 'https://localhost:443/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: 'https://localhost:443/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: 'https://localhost:443/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: 'https://localhost:443/auth/github/callback'
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
  },
  salon_mailer: {
    hairmovement: {
      service: 'gmail',
      auth: {
        user: 'The Hair Movement <hairmovementsalon@gmail.com>',
        pass: 'hairmovement123'
      }
    }
  },
  restaurant_mailer: {
    affyspremiumgrill: {
      service: 'gmail',
      auth: {
        user: 'Affys Orders Dashboard <affysgrill@gmail.com>',
        pass: 'affys123'
      }
    },
    dakshinexpress: {
      service: 'gmail',
      auth: {
        user: 'Dakshin Orders Dashboard <dakshinexpressapp@gmail.com>',
        pass: 'dakshin123'
      }
    }
  }
};
