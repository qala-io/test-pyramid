"use strict";

exports.config = {
  framework: 'jasmine2',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost:8080/',
  specs: ['**.spec.js'],
  capabilities: {
    'browserName': 'phantomjs',
    //'browserName': 'chrome',
    /*
     * Can be used to specify the phantomjs binary path.
     * This can generally be ommitted if you installed phantomjs globally.
     */
    'phantomjs.binary.path': require('phantomjs').path,
    /*
     * Command line args to pass to ghostdriver, phantomjs's browser driver.
     * See https://github.com/detro/ghostdriver#faq
     */
    'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG']
  },
  onPrepare: function() {
    var backend = new (require('./backend-mock/Backend'));
    backend.init();
    global.backend = backend;
  }
};
