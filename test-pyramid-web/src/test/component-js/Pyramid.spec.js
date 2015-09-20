"use strict";
var homePage = new (require('./page/HomePage'));
var Pyramid = require('./domain/Pyramid');
var random = require('random-ext');

describe('Pyramid', function () {
  beforeEach(function () {
    homePage.open();
  });
  ['unit', 'component', 'system'].forEach(function (testType) {
    it(testType + ' test field must be empty by default', function () {
      homePage.clickCreate();
      expect(homePage.getNumberOfTests(testType)).toBe('');
    });
    it(testType + ' test label must be updated as we type', function () {
      homePage.clickCreate();
      homePage.fillNumberOfTests(testType, 10);
      expect(homePage.getLabel(testType)).toBe('100%');
    });
  });
  it('adds newly added item to the list of pyramids w/o page reload', function () {
    var pyramid = homePage.fillPyramid(new Pyramid());
    homePage.clickSave();
    homePage.assertContainsPyramid(pyramid);
  });
  it('escapes HTML-relevant symbols in name w/o page reload', function () {
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
  it('escapes HTML-relevant symbols in name after refresh', function () {
    var pyramid = homePage.fillPyramid(new Pyramid({name: '\'">'}));
    homePage.clickSave();
    homePage.open();
    homePage.assertContainsPyramid(pyramid);
  });
  it('empty name does not allow saving pyramids', function () {
    var pyramid = new Pyramid();
    pyramid.name = '';
    homePage.fillPyramid(pyramid);
    homePage.assertSaveIsNotClickable();
  });
  it('space-only name does not allow saving pyramids', function () {
    var pyramid = new Pyramid();
    pyramid.name = '  ';
    homePage.fillPyramid(pyramid);
    homePage.assertSaveIsNotClickable();
  });
  it('cannot type more than max length of name', function () {
    var pyramid = new Pyramid();
    pyramid.name = random.string(101, 101);
    homePage.fillPyramid(pyramid);
    homePage.assertNameEquals(pyramid.name.slice(0, -1));
  });
  it('creating can be canceled', function () {
    homePage.fillPyramid();
    homePage.cancelEditing();
    homePage.assertPyramidListVisible();
  });
  it('highlights just created pyramid', function(){
    var pyramid = homePage.createPyramid();
    homePage.assertPyramidIsHighlighted(pyramid);
  });
  xit('must clear picture if creating canceled since no pyramid is selected');
});