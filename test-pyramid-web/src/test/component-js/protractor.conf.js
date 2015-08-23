"use strict";

exports.config = {
  framework: 'jasmine2',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost:8080/',
  specs: ['**.spec.js'],
  capabilities: {
    'browserName': 'chrome'
  },
  onPrepare: function() {
    var Backend = require('./backend-mock/Backend');
    var backend = new Backend();
    backend.init();
  }
};
