// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [

      //Testing fixtures
      'bower_components/chai/chai.js',
      'node_modules/chai-spies/chai-spies.js',
      'test/chai-starter.js',
      'bower_components/jasmine.async/src/jasmine.async.js',

      //Dependencies

      'bower_components/lodash/dist/lodash.underscore.js',
      'bower_components/q/q.js',
      'bower_components/jquery/jquery.min.js',
      'src/bower_components/angular/angular.js',
      'src/bower_components/angular-mocks/angular-mocks.js',

      //Project source
      'src/scripts/app.js',
      'src/scripts/facebookSDK.js',
      'src/scripts/facebookLogin.js',

      // All Tests
      'test/spec/*.js'
    ],

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS']

  });
};
