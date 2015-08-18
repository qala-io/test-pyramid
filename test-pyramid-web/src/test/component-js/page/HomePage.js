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

  this.getNumberOfTests = function (testType) {
    return this[testType + 'Tests'].input.getText();
  };
  this.fillNumberOfTests = function (testType, nOfTests) {
    this[testType + 'Tests'].input.sendKeys(nOfTests);
  };
  this.getLabel = function(testType) {
    return this[testType + 'Tests'].label.getText();
  };
};