"use strict";

var homePage = new (require('./page/HomePage'));

describe('Pyramid', function() {
  beforeEach(function(){
    var baseUrl = 'http://localhost:8080/';
    browser.get(baseUrl);
  });
  ['unit', 'component', 'system'].forEach(function(testType) {
    it(testType + ' test field must be empty by default', function() {
      expect(homePage.getNumberOfTests(testType)).toBe('');
    });
    it(testType + ' test label must be updated as we type', function() {
      homePage.fillNumberOfTests(testType, 10);
      expect(homePage.getLabel(testType)).toBe('100%');
    });
    it(testType + ' test label shows error if text is specified', function() {
      homePage.fillNumberOfTests(testType, 'blah');
      expect(homePage.getLabel(testType)).toBe('Numeric value is expected!');
    });
  });
});