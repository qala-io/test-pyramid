'use strict';

describe('PyramidController', function () {
  var sut, $httpBackend;
  beforeEach(angular.mock.module('app.pyramid'));
  beforeEach(angular.mock.inject(function ($injector, $controller) {
    $httpBackend = $injector.get('$httpBackend');
    sut = $controller('PyramidCtrl', {$scope: {}});
    sut.baseUrl = '';
  }));
  ['unitTests', 'componentTests', 'systemTests'].forEach(function (testType) {
    it(testType + ' count must default to empty', function () {
      expect(sut.currentPyramid[testType].count).toBe('');
    });
    it(testType + ' percentage must default to empty', function () {
      expect(sut.currentPyramid[testType].label).toBe('');
    });
    it(testType + ' percentage must update to empty when all counts change back to empty', function () {
      sut.currentPyramid.unitTests.count = '';
      sut.currentPyramid.componentTests.count = '';
      sut.currentPyramid.systemTests.count = '';
      sut.updatePercentage();
      expect(sut.currentPyramid[testType].label).toBe('');
    });
    it(testType + ' percentage must update to empty when all counts changes to 0', function () {
      sut.currentPyramid.unitTests.count = 0;
      sut.currentPyramid.componentTests.count = 0;
      sut.currentPyramid.systemTests.count = 0;
      sut.updatePercentage();
      expect(sut.currentPyramid[testType].label).toBe('');
    });
    it('must set 100% to ' + testType + ' if only count for that test type was filled with number', function () {
      sut.currentPyramid[testType].count = moreThanZero();
      sut.updatePercentage();
      expect(sut.currentPyramid[testType].label).toBe("100%");
    });
    it('must update back to empty ' + testType + ' percents if count of all tests was updated back to empty', function () {
      sut.currentPyramid[testType].count = moreThanZero();
      sut.updatePercentage();

      sut.currentPyramid[testType].count = '';
      sut.updatePercentage();
      expect(sut.currentPyramid[testType].label).toBe('');
    });
    it(testType + ' label must be empty if non-numbers were entered', function () {
      sut.currentPyramid[testType].count = alphabetic();
      sut.updatePercentage();
      expect(sut.currentPyramid[testType].label).toBe('')
    });
    it('must disable save button if ' + testType + ' values is invalid', function () {
      sut.currentPyramid[testType].count = alphabetic();
      sut.updatePercentage();
      expect(sut.valid).toBeFalsy();
    });
  });
  it('must set empty to other test percentages if only count for system tests was filled', function () {
    sut.currentPyramid.systemTests.count = moreThanZero();
    sut.updatePercentage();
    expect(sut.currentPyramid.componentTests.label).toBe('');
    expect(sut.currentPyramid.unitTests.label).toBe('');
  });
  it('test percentage must be empty if sum is more than 0 and one of test counts is non-numeric', function () {
    sut.currentPyramid.unitTests.count = moreThanZero();
    sut.currentPyramid.componentTests.count = alphabetic();
    sut.updatePercentage();

    expect(sut.currentPyramid.unitTests.label).toBe('100%');
    expect(sut.currentPyramid.componentTests.label).toBe('');
  });
  it('must disable save button by default', function () {
    expect(sut.valid).toBeFalsy();
  });
  it('must highlight created pyramid', function(){
    var pyramidResponse = {};
    $httpBackend.when('POST', '/pyramid').respond(pyramidResponse);

    sut.savePyramid();
    $httpBackend.flush();
    expect(sut.savedPyramids[0].highlight).toBeTruthy();
  });
  it('must unhighlight pyramids that were previously saved', function(){
    var pyramidResponse = {};
    $httpBackend.when('POST', '/pyramid').respond(pyramidResponse);

    sut.savePyramid();
    sut.savePyramid();
    $httpBackend.flush();
    expect(sut.savedPyramids[0].highlight).toBeFalsy();
    expect(sut.savedPyramids[1].highlight).toBeTruthy();
  });
  it('must calculate percentage correctly (happy path)', function () {
    sut.currentPyramid.unitTests.count = 10;
    sut.currentPyramid.componentTests.count = 5;
    sut.currentPyramid.systemTests.count = 5;
    sut.updatePercentage();

    expect(sut.currentPyramid.unitTests.label).toBe('50%');
    expect(sut.currentPyramid.componentTests.label).toBe('25%');
    expect(sut.currentPyramid.systemTests.label).toBe('25%');
  });
  it('must round to 2 decimals', function () {
    sut.currentPyramid.unitTests.count = 1;
    sut.currentPyramid.componentTests.count = 1;
    sut.currentPyramid.systemTests.count = 1;
    sut.updatePercentage();

    expect(sut.currentPyramid.unitTests.label).toBe('33.3%');
    expect(sut.currentPyramid.componentTests.label).toBe('33.3%');
    expect(sut.currentPyramid.systemTests.label).toBe('33.3%');
  });
});