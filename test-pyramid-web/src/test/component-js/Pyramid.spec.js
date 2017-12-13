"use strict";
const homePage = new (require('./page/HomePage'));
const Pyramid = require('./domain/Pyramid');
const random = require('random-ext');

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
  it('validation errors are shown if non-valid values are specified', function () {
    homePage.open();
    homePage.fillPyramid(); // we need to clean the name field afterwards to get error
    homePage.fillPyramid(new Pyramid({
      name: '',
      unitTests: alphabetic(5, 1),
      componentTests: alphabetic(5, 1),
      systemTests: alphabetic(5, 1)
    }));
    homePage.assertNumberOfValidationErrors(4);
  });
  it('adds newly added item to the list of pyramids w/o page reload', function () {
    const pyramid = homePage.fillPyramid(new Pyramid());
    homePage.clickSave();
    homePage.assertContainsPyramid(pyramid);
  });
  it('escapes HTML-relevant symbols in name w/o page reload', function () {
    const pyramid = homePage.fillPyramid(new Pyramid({name: '\'">'}));
    homePage.clickSave();
    homePage.assertContainsPyramid(pyramid);
  });
  it('shows item to the list of pyramids after refresh', function () {
    const pyramid = homePage.fillPyramid(new Pyramid());
    homePage.clickSave();
    homePage.open();
    homePage.assertContainsPyramid(pyramid);
  });
  it('escapes HTML-relevant symbols in name after refresh', function () {
    const pyramid = homePage.fillPyramid(new Pyramid({name: '\'">'}));
    homePage.clickSave();
    homePage.open();
    homePage.assertContainsPyramid(pyramid);
  });
  it('empty name does not allow saving pyramids', function () {
    const pyramid = new Pyramid({name: ''});
    homePage.fillPyramid(pyramid);
    homePage.assertSaveIsNotClickable();
  });
  it('space-only name does not allow saving pyramids', function () {
    const pyramid = new Pyramid({name: '  '});
    homePage.fillPyramid(pyramid);
    homePage.assertSaveIsNotClickable();
  });
  it('creating can be canceled', function () {
    homePage.fillPyramid();
    homePage.cancelEditing();
    homePage.assertPyramidListVisible();
  });
  it('must not result in validation error if form was just opened', function () {
    homePage.open();
    homePage.clickCreate();
    homePage.assertNoValidationErrors();
  });
  it('must not result in validation error if form invalid and was reopened after cancel', function () {
    homePage.open();
    homePage.fillPyramid();
    homePage.fillPyramid(Pyramid.empty());
    homePage.cancelEditing();
    homePage.clickCreate();
    homePage.assertNoValidationErrors();
  });
  it('clears form when it is opened even if it was previously filled', function () {
    homePage.open();
    homePage.fillPyramid();
    homePage.cancelEditing();
    homePage.clickCreate();
    homePage.assertFormIsEmpty();
  });
  it('cannot type more than max length of name', function () {
    const pyramid = new Pyramid();
    pyramid.name = random.string(101, 101);
    homePage.fillPyramid(pyramid);
    homePage.assertNameEquals(pyramid.name.slice(0, -1));
  });
  it('highlights just created pyramid', function () {
    const pyramid = homePage.createPyramid();
    homePage.assertPyramidIsHighlighted(pyramid);
  });
  xit('must clear picture if creating canceled since no pyramid is selected (manual test case)');
});

function alphabetic(max, min) {
  return random.restrictedString([random.CHAR_TYPE.UPPERCASE, random.CHAR_TYPE.LOWERCASE], max, min);
}