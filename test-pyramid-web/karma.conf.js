module.exports = function(config){
  config.set({
    basePath : '../../../',
    autoWatch : true,
    singleRun: true,
    reporters: ['progress', 'junit', 'allure'],
    files : [
      'src/main/resources/js/lib/angular.min.js',
      'src/test/js/angular-mocks.js',
      'src/main/resources/js/controllers.js',
      'src/test/js/KarmaConfigurationTest.js',
      'src/test/js/UserRatingTest.js'
    ],
    frameworks: ['jasmine'],
    browsers : ['PhantomJS'], //can be phantomJS
    plugins : [
      'karma-phantomjs-launcher',
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