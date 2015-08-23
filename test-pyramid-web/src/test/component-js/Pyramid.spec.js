"use strict";
var homePage = new (require('./page/HomePage'));
var Pyramid = require('./domain/Pyramid');

describe('Pyramid', function () {
  beforeEach(function () {
    browser.get('http://localhost:8080/');
  });
  ['unit', 'component', 'system'].forEach(function (testType) {
    it(testType + ' test field must be empty by default', function () {
      expect(homePage.getNumberOfTests(testType)).toBe('');
    });
    it(testType + ' test label must be updated as we type', function () {
      homePage.fillNumberOfTests(testType, 10);
      expect(homePage.getLabel(testType)).toBe('100%');
    });
    it(testType + ' test label shows error if text is specified', function () {
      homePage.fillNumberOfTests(testType, 'blah');
      expect(homePage.getLabel(testType)).toBe('Numeric value is expected!');
    });
  });
  it('shows that everything is good if Pyramid was saved by back end', function () {
    var pyramid = homePage.fillPyramid(new Pyramid());
    homePage.clickSave();
    backend.assertContainsPyramid(pyramid);
  });
});