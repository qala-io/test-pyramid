(function () {
  'use strict';

  angular.module('pyramid', [])
    .controller('PyramidCtrl', PyramidController);

  function PyramidController() {
    var vm = this;
    vm.unitTests = {count: '', percentage: '', color: 'green'};
    vm.componentTests = {count: '', percentage: '', color: 'green'};
    vm.systemTests = {count: '', percentage: '', color: 'green'};

    vm.updatePercentage = function () {
      var unitTestsCount = +vm.unitTests.count || 0;
      var componentTestsCount = +vm.componentTests.count || 0;
      var systemTestsCount = +vm.systemTests.count || 0;
      var sum = unitTestsCount + componentTestsCount + systemTestsCount;
      if (sum !== 0) {
        vm.unitTests.percentage = (unitTestsCount / sum) * 100 + "%";
        vm.componentTests.percentage = (componentTestsCount / sum) * 100 + "%";
        vm.systemTests.percentage = (systemTestsCount / sum) * 100 + "%";
      } else {
        vm.unitTests.percentage = '';
        vm.componentTests.percentage = '';
        vm.systemTests.percentage = '';
      }
    };
  }
})();