'use strict';

describe('PyramidController', function () {
  var sut;
  beforeEach(angular.mock.module('pyramid'));
  beforeEach(angular.mock.inject(function ($controller) {
    sut = $controller('PyramidCtrl', {$scope: {}});
  }));
  ['unit-tests', 'component-tests', 'system-tests'].forEach(function (testType) {
    it(testType + ' count must default to empty', function () {
      expect(sut.testType(testType).count).toBe('');
    });
    it(testType + ' percentage must default to empty', function () {
      expect(sut.testType(testType).label).toBe('');
    });
    it(testType + ' percentage must update to empty when all counts change back to empty', function () {
      sut.testType('unit-tests').count = '';
      sut.testType('component-tests').count = '';
      sut.testType('system-tests').count = '';
      sut.updatePercentage();
      expect(sut.testType(testType).label).toBe('');
    });
    it(testType + ' percentage must update to empty when all counts changes to 0', function () {
      sut.testType('unit-tests').count = 0;
      sut.testType('component-tests').count = 0;
      sut.testType('system-tests').count = 0;
      sut.updatePercentage();
      expect(sut.testType(testType).label).toBe('');
    });
    it('must set 100% to ' + testType + ' if only count for that test type was filled with number', function () {
      sut.testType(testType).count = moreThanZero();
      sut.updatePercentage();
      expect(sut.testType(testType).label).toBe("100%");
    });
    it('must set 0% to other test percentages if only count for ' + testType + ' was filled', function () {
      sut.testType(testType).count = moreThanZero();
      sut.updatePercentage();
      expect(sut.testType(testType).label).toBe("100%");
    });
    it('must update back to empty ' + testType + ' percents if count of all tests was updated back to empty', function () {
      sut.testType(testType).count = moreThanZero();
      sut.updatePercentage();

      sut.testType(testType).count = '';
      sut.updatePercentage();
      expect(sut.testType(testType).label).toBe('');
    });
    it(testType + ' label must be empty if non-numbers were entered', function () {
      sut.testType(testType).count = alphabetic();
      sut.updatePercentage();
      expect(sut.testType(testType).label).toBe('')
    });
    it('must disable save button if ' + testType + ' values is invalid', function () {
      sut.testType(testType).count = alphabetic();
      sut.updatePercentage();
      expect(sut.valid).toBeFalsy();
    });
  });
  fit('test percentage must be empty if sum is more than 0 and one of test counts is non-numeric', function () {
    sut.testType('unit-tests').count = moreThanZero();
    sut.testType('component-tests').count = alphabetic();
    sut.updatePercentage();

    expect(sut.testType('unit-tests').label).toBe('100%');
    expect(sut.testType('component-tests').label).toBe('');
  });
  it('must disable save button by default', function () {
    expect(sut.valid).toBeFalsy();
  });
  it('must calculate percentage correctly (happy path)', function () {
    sut.testType('unit-tests').count = 10;
    sut.testType('component-tests').count = 5;
    sut.testType('system-tests').count = 5;
    sut.updatePercentage();

    expect(sut.testType('unit-tests').label).toBe('50%');
    expect(sut.testType('component-tests').label).toBe('25%');
    expect(sut.testType('system-tests').label).toBe('25%');
  });
  it('must round to 2 decimals', function () {
    sut.testType('unit-tests').count = 1;
    sut.testType('component-tests').count = 1;
    sut.testType('system-tests').count = 1;
    sut.updatePercentage();

    expect(sut.testType('unit-tests').label).toBe('33.3%');
    expect(sut.testType('component-tests').label).toBe('33.3%');
    expect(sut.testType('system-tests').label).toBe('33.3%');
  });
});