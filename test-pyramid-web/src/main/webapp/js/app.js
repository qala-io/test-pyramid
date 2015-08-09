//(function () {
  'use strict';

  var app = angular.module('pyramid', []);
  app.controller('PyramidCtrl', PyramidController);

  function PyramidController($scope) {
    $scope.unitTests = {count: 0, percentage: '', color: 'green'};
    $scope.componentTests = {count: 0, percentage: '', color: 'green'};
    $scope.systemTests = {count: 0, percentage: '', color: 'green'};

    $scope.updatePercentage = function () {
      var unitTestsCount = $scope.unitTests.count;
      var componentTestsCount = $scope.componentTests.count;
      var systemTestsCount = $scope.systemTests.count;
      var sum = unitTestsCount + componentTestsCount + systemTestsCount;
      if (sum) {
        $scope.unitTests.percentage = (unitTestsCount / sum) * 100 + "%";
        $scope.componentTests.percentage = (componentTestsCount / sum) * 100 + "%";
        $scope.systemTests.percentage = (systemTestsCount / sum) * 100 + "%";
      }
    };
  }
//});