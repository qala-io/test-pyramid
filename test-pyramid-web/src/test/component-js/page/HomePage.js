"use strict";
var Pyramid = require('../domain/Pyramid');
module.exports = function HomePage() {
  this.unitTests = {
    input: element(by.id('n-of-unit-tests')),
    label: element(by.id('unit-tests-label'))
  };
  this.componentTests = {
    input: element(by.id('n-of-component-tests')),
    label: element(by.id('component-tests-label'))
  };
  this.systemTests = {
    input: element(by.id('n-of-system-tests')),
    label: element(by.id('system-tests-label'))
  };
  this.saveBtn = element(by.id('save-btn'));
  this.nameInput = element(by.id('project-name'));
  this.pyramidList = element(by.id('pyramid-list'));

  this.open = function() {
    browser.get(browser.baseUrl);
  };

  this.createPyramid = function(pyramid) {
    pyramid = pyramid || new Pyramid();
    this.open();
    this.fillPyramid(pyramid);
    this.clickSave();
    return pyramid;
  };
  this.fillPyramid = function (pyramid) {
    this.fillName(pyramid.name);
    this.fillNumberOfTests('unit', pyramid.nOfUnitTests);
    this.fillNumberOfTests('component', pyramid.nOfComponentTests);
    this.fillNumberOfTests('system', pyramid.nOfSystemTests);
    return pyramid;
  };
  this.assertContainsPyramid = function (pyramid) {
    this.pyramidList.all(by.css('[name="pyramid-row"]')).then(function (elements) {
      var pyramidsOnPage = [];
      elements.forEach(function (element) {
        var fromPage = Pyramid.empty();
        element.element(by.css('[name="pyramid-name"]')).getText().then(function (text) {
          fromPage.name = text;
        });
        element.element(by.css('[name="pyramid-n-of-unit-tests"]')).getText().then(function (text) {
          fromPage.nOfUnitTests = +text;
        });
        element.element(by.css('[name="pyramid-n-of-component-tests"]')).getText().then(function (text) {
          fromPage.nOfComponentTests = +text;
        });
        element.element(by.css('[name="pyramid-n-of-system-tests"]')).getText().then(function (text) {
          fromPage.nOfSystemTests = +text;
        });
        browser.controlFlow().execute(function () {
          pyramidsOnPage.push(fromPage)
        });
      });
      return pyramidsOnPage;
    }).then(function (pyramidsOnPage) {
      pyramid.assertIsPresentIn(pyramidsOnPage, true);
    });
  };
  this.fillName = function (name) {
    this.nameInput.sendKeys(name);
  };
  this.getNumberOfTests = function (testType) {
    return this[testType + 'Tests'].input.getText();
  };
  this.fillNumberOfTests = function (testType, nOfTests) {
    this[testType + 'Tests'].input.sendKeys(nOfTests);
  };
  this.getLabel = function (testType) {
    return this[testType + 'Tests'].label.getText();
  };
  this.clickSave = function () {
    this.saveBtn.click();
  };
};