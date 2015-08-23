"use strict";

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

  this.fillPyramid = function(pyramid) {
    this.fillName(pyramid.name);
    this.fillNumberOfTests('unit', pyramid.nOfUnitTests);
    this.fillNumberOfTests('component', pyramid.nOfComponentTests);
    this.fillNumberOfTests('system', pyramid.nOfSystemTests);
    return pyramid;
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
  this.getLabel = function(testType) {
    return this[testType + 'Tests'].label.getText();
  };
  this.clickSave = function() {
    this.saveBtn.click();
  };
};