"use strict";
const homePage = require('./Pages').homePage;
const Pyramid = require('./Domain').Pyramid;

describe('Pyramid', function () {
  it('adds newly added item to the list of pyramids w/o page reload', function () {
    const pyramid = homePage.createPyramid();
    homePage.assertContainsPyramid(pyramid);
  });
  /** This is done by server side when page is generated. */
  it('shows item in the list of pyramids after refresh', function () {
    const pyramid = homePage.createPyramid();
    homePage.open();
    homePage.assertContainsPyramid(pyramid);
  });
  /** This is done by server side when page is generated. */
  it('escapes HTML-relevant symbols in name after refresh', function() {
    const pyramid = homePage.createPyramid(new Pyramid({name: '\'">'}));
    homePage.open();
    homePage.assertContainsPyramid(pyramid);
  });
});