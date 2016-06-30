'use strict';

module.exports = {
  app: {
    title: 'ReciFlix',
    description: 'ReciFlix App allows convenient way to search and watch a recipe video online. Users can add recipes to favorites to watch them later from any device anywhere.',
    keywords: 'recipes, cooking, healthycooking, desserts, savouries, food, preparation,recipes, recipes for chicken breast, recipes for chicken, recipes for diabetics, recipes for kids, recipes for toddlers, recipes for beauty, recipes for snacks,recipes appetizers,recipes apple pie ,recipes app ,recipes all ,recipes by ingredients ,recipes based on ingredients ,recipes beef stew ,recipes butternut squash ,recipes broccoli ,recipes breakfast ,recipes cookies ,recipes chili ,recipes desserts ,recipes dinner ,recipes easy ,recipes eggplant ,recipes eggs ,recipes everyone should know ,recipes grits ,recipes green beans ,recipes healthy ,recipes high in protein ,recipes high in iron ,recipes holiday ,recipes in telugu ,recipes ideas ,recipes juicing ,recipes kids can make ,recipes kids love ,recipes kidney beans ,recipes kale chips ,recipes meatloaf ,recipes mushrooms ,recipes navy beans ,recipes noodles ,recipes online ,recipes of india ,recipes on facebook ,recipes of the day ,recipes of desserts ,recipes on today show ,recipes pasta ,recipes potatoes ,recipes quick and easy ,recipes red beans and rice ,recipes rice ,recipes red potatoes ,recipes round steak ,recipes soup ,recipes salad ,recipes to lose weight ,recipes to lower cholesterol ,recipes that use buttermilk ,recipes that use a lot of milk ,recipes to freeze ,recipes using egg noodles ,recipes vegetables ,recipes vegetarian ,recipes vitamix ,recipes youtube ,recipes yogurt ,recipes zero belly diet ,recipes zero belly fat ,recipes 100 calories or less ,oats recipes ,recipes 2015 ,recipes 2014 ,recipes 200 calories ,food preparation course ,food preparation ,food preparation techniques ,food preparation for the week ,food preparation basics ,food preparation diet ,food preparation essay ,food preparation flow chart ,food preparation for the week ,food preparation health and safety ,food preparation ideas ,food preparation kitchen ,food preparation menu ,food preparation meals ,food preparation notes ,food preparation nutrition ,kitchen,fassfood, dinner,breakfast,seafood,food,curries',
    facebookAppId: '1607966326154856'
  },

  //TODO need to move
  //AWS setup
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || 'AKIAJFMJAAAMJM4A62RA',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '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',

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
    'public/lib/metisMenu/dist/metisMenu.min.css',
    'public/lib/fontawesome/css/font-awesome.min.css',
    'public/lib/toastr/toastr.min.css',
    'public/lib/angular-ui-select/dist/select.min.css',
    'public/lib/select2/select2.css'

   ],
      js: [
/*    'public/lib/angular/angular.js',
    'public/lib/angular-resource/angular-resource.js',
    'public/lib/angular-animate/angular-animate.js',
    'public/lib/angular-ui-router/release/angular-ui-router.js',
    'public/lib/angular-ui-utils/ui-utils.js',
    'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
    'public/lib/jquery/dist/jquery.min.js',
    'public/lib/angular-ui-select/dist/select.js',
     'public/lib/ngstorage/ngStorage.js',*/

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
    'public/lib/hello/dist/hello.all.js',
    'public/lib/ng-file-upload/ng-file-upload-shim.min.js',
    'public/lib/ng-file-upload/ng-file-upload.min.js',
    'public/lib/angular-ui-select/dist/select.min.js',
    'public/lib/select2/select2.min.js',
    'public/lib/angular-update-meta/dist/update-meta.min.js',
    'public/lib/angularjs-socialshare/dist/angular-socialshare.min.js'
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
  },
  stripe_info: {
    support_email: process.env.STRIPE_EMAILID || 'support@reciflix.com',
    //firebase_serviceAccountCredentials_file_path: '../../app/assets/MenuBuddy-aba5feed8387.json',
    firebase_databaseURL: 'https://project-6234769546084498557.firebaseio.com',
    firebase_serviceAccount: {
      "project_id": "project-6234769546084498557",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCmF6u9FgbWVo5F\nJAG01lh4+0DJ+xS3tEo+JMtJpaY5IWurkiAalgLjLNRBvmtJn3bGjX9VWQ285pL8\niDnarDDNzYifalICyqLHXN0CU70Koy6mtWAKycKu4vVt7qhov7n0XDQXIft54dff\nn41i7NyFSlzUn51PXiS0+4sQjay7Ekw8kxtqPgbyYBZdUBHo1jijuduAcbOpphhg\nOfonekDaF/Km6kbfmMgPfanGZFi599JVl/tEqLAUF9m16AteLsN75OfZWmBJWMFQ\novrzzNIP+5TWkSKTeZ3kmgS/zKJtS6KT644FleJdLbN7+FqJyhrpMOzQH0bVrY6q\nvgqzVDxHAgMBAAECggEBAKWbwI/fIJ4i2+SwzErF1p162NUMV1H8oHJqOZCLbLxW\nSIdgQkaAAQ0HK/UJquxT5hiACdDN5NbPiQvnwNf7DQaHw4xAdNl3turV+0BQwpOS\ntfdfrg3TsxyyDEm6x4z6bq3qKb5PEfIrcBX3fwB+cDsvNHSFWlNC6ZLTpYux1+MF\n9FZ17/ooH82iVYcSzJk9s4Q0+gE7hWfbHJqSYdpKbGrmvJIv1ae2BTuMYpTccVp0\nzyqELXYmz/Gs3408o/HGIu1DVo/sVjltjEhfGDV3yrZng2vuiZ9n9Dkp2VhtoA4l\nx0DksV8ihNZGb1lWx3Kfob4b9SgZWlMSla4bxrWMVSECgYEA5AoHVeQEKWILfnau\nsvOGmRCfBcP24uICkbeoVjXJ2HN1lG9qXgLbuelaXF/MstX2xOkL71max3MP3PA+\nDQA8t9fNK75BsKsruGCYoEjPTb6MtumU4NGiZRidmceCt8p7J/VurTBxLQTtw7Ha\nlnyreaxSEjDiOIh2SmLaCfmHO/8CgYEAunUu9DLF03sWsMuzDml9jOdW3BL5fCd0\nHwP2fF2kQKvSkIPoNm7Dwi4vqHDqSQIrRyQO5w9elmmF+QzKl2EYTVVzGheXL1s3\nkQsjFnHLELFr4eJ6f+YEfsTNA0cNZz2Fd4uI3XbQzxqS47tktes6ZXrHGboEa9g3\nhbfDk9eqH7kCgYADsRnfTRq4JMs01+0KHqEuNzOr3zlPAQOzojqKcsJ6y5u6tHcP\nYJJ4FwwMdMyWlJozI+a6kEPOONGn7QfEJB3XiBndPG5J0uuZR48RATzB8HTMvUlY\nvmwXoOdkRvOZ0CBgTDvnd+JNLUhAI8/7IbeQ97Y4bywqaCMqHyGSicSjtwKBgHzz\nNmny9FsKK2SCvRU1YCtig/SqyoGGtuxp7W3eGsoz2sF5g82mYIzqAonwUTBnwbTE\n1y/EPvCw+lSxW7oiGPUKBD5B/NCBYjVSr0rFKv2ex9rxuIGpFO4W2AQQQ00iDyTT\nXv56NufyuOjflVfLsLB8nJwC6h+TH3H+eZPDfIARAoGBANJgfR4Zbzep83hif8Fg\nPiLltWxAV4Z9p+x4NqAs/UY/kMXTTesQVka0KxFXZOn9Q/EvO09mHjBXfgo302Ok\nqyr3d9nQuwG5MsCsqKNmRtw+o+rvGMPbHyUopn8A8S65hkMQqa9/VLeCcsiJZ50E\nhuNTTKJfeL1Irxjo0OxLOucV\n-----END PRIVATE KEY-----\n",
      "client_email": "menubuddy@project-6234769546084498557.iam.gserviceaccount.com"
    }
  }
};
