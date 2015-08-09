'use strict';
var moreThanZero = require('./utils.js').moreThanZero;

describe('PyramidController', function () {
  var $scope = {}, controller;
  beforeEach(angular.mock.module('pyramid'));
  beforeEach(angular.mock.inject(function ($controller) {
    $scope = {};
    controller = $controller('PyramidCtrl', {$scope: $scope});
  }));

  it('must default values to 0', function () {
    expect($scope.unitTests.count).toBe(0);
    expect($scope.componentTests.count).toBe(0);
    expect($scope.systemTests.count).toBe(0);
  });
  ['unitTests', 'componentTests', 'systemTests'].forEach(function (testType) {
    it('must set 100% to ' + testType + ' if only count for ' + testType + ' was filled the rest were 0', function () {
      $scope[testType].count = moreThanZero();
      $scope.updatePercentage();
      expect($scope[testType].percentage).toBe("100%");
    });
  });
});