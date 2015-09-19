module.exports = function(config){
  config.set({
    basePath : '../../../',
    autoWatch : true,
    singleRun: true,
    reporters: ['progress', 'junit'],
    files : [
      'src/main/webapp/vendor/angular/angular.js',
      'src/test/unit-js/utils/angular-mocks.js',
      'src/main/webapp/js/app.js',
      'src/test/unit-js/utils/browser-js-random-ext.js',
      'src/test/unit-js/utils/utils.js',
      'src/test/unit-js/*.spec.js'
    ],
    frameworks: ['jasmine'],
    browsers : ['PhantomJS'],
    plugins : [
      'karma-phantomjs-launcher',
      'karma-phantomjs2-launcher',
      'karma-slimerjs-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-allure-reporter'
    ],
    junitReporter : {
      outputFile: 'target/surefire-reports/js-unit.xml',
      suite: 'unit'
    },
    allureReport: {
      reportDir: 'target/allure-results'
    }
  });
};