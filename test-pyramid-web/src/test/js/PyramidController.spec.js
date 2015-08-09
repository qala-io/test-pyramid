'use strict';
var moreThanZero = require('./utils.js').moreThanZero;

describe('PyramidController', function () {
  var sut;
  beforeEach(angular.mock.module('pyramid'));
  beforeEach(angular.mock.inject(function ($controller) {
    sut = $controller('PyramidCtrl', {$scope: {}});
  }));
  ['unitTests', 'componentTests', 'systemTests'].forEach(function (testType) {
    it(testType + ' count must default to empty', function () {
      expect(sut[testType].count).toBe('');
    });
    it(testType + ' percentage must default to empty', function () {
      expect(sut[testType].label).toBe('');
    });
    it(testType + ' percentage must update to empty when all counts changes to empty', function () {
      sut.unitTests.count = '';
      sut.componentTests.count = '';
      sut.systemTests.count = '';
      sut.updatePercentage();
      expect(sut[testType].label).toBe('');
    });
    it(testType + ' percentage must update to empty when all counts changes to 0', function () {
      sut.unitTests.count = 0;
      sut.componentTests.count = 0;
      sut.systemTests.count = 0;
      sut.updatePercentage();
      expect(sut[testType].label).toBe('');
    });
    it('must set 100% to ' + testType + ' if only count for that test type was filled with number', function () {
      sut[testType].count = moreThanZero();
      sut.updatePercentage();
      expect(sut[testType].label).toBe("100%");
    });
    it('must set 0% to other test percentages if only count for ' + testType + ' was filled', function () {
      sut[testType].count = moreThanZero();
      sut.updatePercentage();
      expect(sut[testType].label).toBe("100%");
    });
    it('must update back to empty ' + testType + ' percents if count of all tests was updated back to empty', function () {
      sut[testType].count = moreThanZero();
      sut.updatePercentage();

      sut[testType].count = '';
      sut.updatePercentage();
      expect(sut[testType].label).toBe('');
    });
    it(testType + ' label must show error if non-numbers were entered', function() {
      sut[testType].count = 'abc';
      sut.updatePercentage();
      expect(sut[testType].label).toBe('Numeric value is expected!')
    });
  });
  it('must calculate percentage correctly (happy path)', function() {
    sut.unitTests.count = 10;
    sut.componentTests.count = 5;
    sut.systemTests.count = 5;
    sut.updatePercentage();

    expect(sut.unitTests.label).toBe('50%');
    expect(sut.componentTests.label).toBe('25%');
    expect(sut.systemTests.label).toBe('25%');
  });
});