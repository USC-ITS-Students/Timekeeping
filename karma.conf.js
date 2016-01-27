// Karma configuration
// Generated on Thu Oct 08 2015 16:09:27 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    //plugins
    plugins : [
        'karma-jasmine',
        'karma-requirejs',
        'karma-junit-reporter',
        'karma-phantomjs-launcher'
    ],

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'node_modules/angular/angular.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'node_modules/angular-route/angular-route.js',
        'src/public/**/*.js'
    ],


    // list of files to exclude
    exclude: [
        'src/public/css/**/*.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'dots', 'junit'],
    junitReporter:  {
        outputDir: 'test_reports/',
        outputFile: 'test-results.xml',
        useBrowserName: false
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing test whenever any file changes
    autoWatch: true,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the test and exits
    singleRun: true

 });
};
