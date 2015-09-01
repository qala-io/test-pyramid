"use strict";
var homePage = new (require('./page/HomePage'));
var Pyramid = require('./domain/Pyramid');

describe('Pyramid', function () {
  beforeEach(function () {
    homePage.open();
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
  it('adds newly added item to the list of pyramids w/o page reload', function () {
    var pyramid = homePage.fillPyramid(new Pyramid());
    homePage.clickSave();
    homePage.assertContainsPyramid(pyramid);
  });
  it('escapes HTML-relevant symbols in name w/o page reload', function() {
    var pyramid = homePage.fillPyramid(new Pyramid({name: '\'">'}));
    homePage.clickSave();
    homePage.assertContainsPyramid(pyramid);
  });
  it('shows item to the list of pyramids after refresh', function () {
    var pyramid = homePage.fillPyramid(new Pyramid());
    homePage.clickSave();
    homePage.open();
    homePage.assertContainsPyramid(pyramid);
  });
  it('escapes HTML-relevant symbols in name after refresh', function() {
    var pyramid = homePage.fillPyramid(new Pyramid({name: '\'">'}));
    homePage.clickSave();
    homePage.open();
    homePage.assertContainsPyramid(pyramid);
  });
  it('validation error does not allow saving pyramids', function() {
    var pyramid = new Pyramid();
    pyramid.name = '';
    homePage.fillPyramid(pyramid);
    homePage.assertSaveIsNotClickable();
  });
});