module.exports = function(config){
  config.set({
    basePath : '../../../',
    autoWatch : true,
    singleRun: true,
    reporters: ['progress', 'junit', 'allure'],
    files : [
      'src/main/webapp/js/vendor/angular.min.js',
      'src/test/js/angular-mocks.js',
      'src/main/webapp/js/app.js',
      'src/test/js/PyramidControllerTest.js'
    ],
    frameworks: ['jasmine'],
    browsers : ['PhantomJS'],
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