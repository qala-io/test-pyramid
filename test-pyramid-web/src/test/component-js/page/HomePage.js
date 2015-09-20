"use strict";
var Pyramid = require('../domain/Pyramid');
module.exports = function () {
  var self = this;
  this.createPyramidBtn = element(by.id('create-pyramid-btn'));
  this.cancelEditingBtn = element(by.id('cancel-btn'));
  this.pyramidList = element(by.id('pyramid-list'));
  this.highlightedPyramid = $('.highlighted-pyramid');
  this.elementsWithValidationError = $$('.has-error');
  this.unitTests = {
    input: element(by.id('n-of-unit-tests')),
    label: element(by.id('unit-tests-label')),
    errorLbl: element(by.id('unit-tests-error-msg'))
  };
  this.componentTests = {
    input: element(by.id('n-of-component-tests')),
    label: element(by.id('component-tests-label')),
    errorLbl: element(by.id('component-tests-error-msg'))
  };
  this.systemTests = {
    input: element(by.id('n-of-system-tests')),
    label: element(by.id('system-tests-label')),
    errorLbl: element(by.id('system-tests-error-msg'))
  };
  this.saveBtn = element(by.id('save-btn'));
  this.nameInput = element(by.id('project-name'));
  this.pyramidList = element(by.id('pyramid-list'));

  this.open = function () {
    browser.get(browser.baseUrl);
  };
  this.createPyramid = function (pyramid) {
    this.open();
    pyramid = this.fillPyramid(pyramid);
    this.clickSave();
    return pyramid;
  };
  this.fillPyramid = function (pyramid) {
    pyramid = pyramid || new Pyramid();
    self.clickCreate();
    self.fillName(pyramid.name);
    self.fillNumberOfTests('unit', pyramid.nOfUnitTests);
    self.fillNumberOfTests('component', pyramid.nOfComponentTests);
    self.fillNumberOfTests('system', pyramid.nOfSystemTests);
    return pyramid;
  };

  this.assertContainsPyramid = function (pyramid) {
    self.pyramidList.all(by.css('[name="pyramid-row"]')).then(function (elements) {
      var pyramidsOnPage = [];
      elements.forEach(function (element) {
        getPyramidObject(element).then(function (fromPage) {
          pyramidsOnPage.push(fromPage);
        });
      });
      return pyramidsOnPage;
    }).then(function (pyramidsOnPage) {
      pyramid.assertIsPresentIn(pyramidsOnPage, true);
    });
  };
  function getPyramidObject(element) {
    return browser.controlFlow().execute(function () {
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
      return fromPage;
    });
  }

  this.assertNoValidationErrors = function () {
    expect(self.elementsWithValidationError.count()).toBe(0);
  };
  this.assertNumberOfValidationErrors = function(n) {
    expect(self.elementsWithValidationError.count()).toBe(n);
  };
  this.assertFormIsEmpty = function() {
    expect(self.nameInput.getText()).toBe('');
    expect(self.unitTests.input.getText()).toBe('');
    expect(self.componentTests.input.getText()).toBe('');
    expect(self.systemTests.input.getText()).toBe('');
  };
  this.assertPyramidIsHighlighted = function (pyramid) {
    getPyramidObject(self.highlightedPyramid).then(function (fromPage) {
      pyramid.assertIsPresentIn([fromPage], true);
    });
  };
  this.fillName = function (name) {
    name && self.nameInput.sendKeys(name);
    name || self.nameInput.clear();
  };
  this.assertNameEquals = function (expectedText) {
    self.nameInput.getAttribute('value').then(function (text) {
      expect(text).toBe(expectedText);
    });
  };
  this.getNumberOfTests = function (testType) {
    return self[testType + 'Tests'].input.getText();
  };
  this.fillNumberOfTests = function (testType, nOfTests) {
    self[testType + 'Tests'].input.sendKeys(nOfTests);
  };
  this.getLabel = function (testType) {
    return self[testType + 'Tests'].label.getText();
  };
  this.cancelEditing = function () {
    return self.cancelEditingBtn.click();
  };
  this.assertPyramidListVisible = function () {
    expect(self.pyramidList.isDisplayed()).toBeTruthy();
  };
  this.clickSave = function () {
    self.saveBtn.click();
  };
  this.clickCreate = function () {
    self.createPyramidBtn.click();
  };
  this.assertSaveIsNotClickable = function () {
    expect(self.saveBtn.isEnabled()).toBeFalsy();
  };
};