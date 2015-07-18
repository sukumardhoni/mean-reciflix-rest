'use strict';

module.exports = {
  app: {
    title: 'ReciFlix mobile app to access, view and share best recipes online',
    description: 'ReciFlix App allows convenient way to search and watch a recipe video online. Users can add recipes to favorites to watch them later from any device anywhere.',
    keywords: 'recipes, cooking, healthycooking, desserts, savouries, food, preparation,recipes, recipes for chicken breast, recipes for chicken, recipes for diabetics, recipes for kids, recipes for toddlers, recipes for beauty, recipes for snacks,recipes appetizers,recipes apple pie ,recipes app ,recipes all ,recipes by ingredients ,recipes based on ingredients ,recipes beef stew ,recipes butternut squash ,recipes broccoli ,recipes breakfast ,recipes cookies ,recipes chili ,recipes desserts ,recipes dinner ,recipes easy ,recipes eggplant ,recipes eggs ,recipes everyone should know ,recipes grits ,recipes green beans ,recipes healthy ,recipes high in protein ,recipes high in iron ,recipes holiday ,recipes in telugu ,recipes ideas ,recipes juicing ,recipes kids can make ,recipes kids love ,recipes kidney beans ,recipes kale chips ,recipes meatloaf ,recipes mushrooms ,recipes navy beans ,recipes noodles ,recipes online ,recipes of india ,recipes on facebook ,recipes of the day ,recipes of desserts ,recipes on today show ,recipes pasta ,recipes potatoes ,recipes quick and easy ,recipes red beans and rice ,recipes rice ,recipes red potatoes ,recipes round steak ,recipes soup ,recipes salad ,recipes to lose weight ,recipes to lower cholesterol ,recipes that use buttermilk ,recipes that use a lot of milk ,recipes to freeze ,recipes using egg noodles ,recipes vegetables ,recipes vegetarian ,recipes vitamix ,recipes youtube ,recipes yogurt ,recipes zero belly diet ,recipes zero belly fat ,recipes 100 calories or less ,oats recipes ,recipes 2015 ,recipes 2014 ,recipes 200 calories ,food preparation course ,food preparation ,food preparation techniques ,food preparation for the week ,food preparation basics ,food preparation diet ,food preparation essay ,food preparation flow chart ,food preparation for the week ,food preparation health and safety ,food preparation ideas ,food preparation kitchen ,food preparation menu ,food preparation meals ,food preparation notes ,food preparation nutrition ,kitchen,fassfood, dinner,breakfast,seafood,food,curries'
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
     'public/lib/ngstorage/ngStorage.js',


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
