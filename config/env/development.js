'use strict';

module.exports = {
  redis: {
    uri: process.env.DEV_REDIS_URL || 'redis://127.0.0.1:6379'
  },
  db: {
    uri: 'mongodb://localhost/recflixdev',
    options: {
      user: '',
      pass: ''
    }
  },
  log: {
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    // Stream defaults to process.stdout
    // Uncomment to enable logging to a log on the file system
    options: {
      //stream: 'access.log'
    }
  },
  app: {
    title: 'Dev: ReciFlix'
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
    clientID: process.env.GOOGLE_ID || '512199517355-keu3sicfllh719ghbveivg6ic40lq4dr.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || '8k5YCsjWIGFfKE6qyCqjOvR-',
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
      port: 26,
      tls: {
        rejectUnauthorized: false
      },
      auth: {
        user: 'support@reciflix.com',
        pass: 'gtmsupport123'
      }
    }
  },
  restaurant_mailer: {
    affyspremiumgrill: {
      from: process.env.MAILER_FROM || 'Affys Orders Dashboard <support@reciflix.com>',
      options: {
        host: 'reciflix.com',
        port: 26,
        tls: {
          rejectUnauthorized: false
        },
        auth: {
          user: 'support@reciflix.com',
          pass: 'gtmsupport123'
        }
      }
    },
    dakshinexpress: {
      from: process.env.MAILER_FROM || 'Dakshin Orders Dashboard <support@reciflix.com>',
      options: {
        host: 'reciflix.com',
        port: 26,
        tls: {
          rejectUnauthorized: false
        },
        auth: {
          user: 'support@reciflix.com',
          pass: 'gtmsupport123'
        }
      }
    }
  }
};
