module.exports = function(config){
  config.set({
    basePath : '../../../',
    autoWatch : true,
    singleRun: true,
    reporters: ['progress', 'junit', 'allure'],
    files : [
      'src/main/webapp/js/vendor/angular.js',
      'src/test/unit-js/angular-mocks.js',
      'src/main/webapp/js/app.js',
      'src/test/unit-js/PyramidController.spec.js'
    ],
    frameworks: ['jasmine', 'browserify'],
    browsers : ['PhantomJS'],
    plugins : [
      'karma-phantomjs-launcher',
      'karma-phantomjs2-launcher',
      'karma-slimerjs-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-allure-reporter',
      'karma-browserify'
    ],
    preprocessors: {
      'src/test/unit-js/*.spec.js': [ 'browserify' ]
    },
    browserify: {
      debug: true
    },
    junitReporter : {
      outputFile: 'target/surefire-reports/js-unit.xml',
      suite: 'unit'
    },
    allureReport: {
      reportDir: 'target/allure-results'
    }
  });
};