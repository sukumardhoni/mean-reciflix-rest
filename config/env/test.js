'use strict';

module.exports = {
  redis: {
    uri: process.env.TEST_REDIS_URL || 'redis://127.0.0.1:6379'
  },
  db: {
    //uri: 'mongodb://meantest:meantest@ds059651.mongolab.com:59651/meantest',
    uri: 'mongodb://localhost/mean-test',
    options: {
      user: '',
      pass: ''
    }
  },
  port: 3001,
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
    title: 'Test: ReciFlix'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
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
