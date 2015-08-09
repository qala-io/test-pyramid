(function () {
  'use strict';

  angular.module('pyramid', [])
    .controller('PyramidCtrl', PyramidController);

  function PyramidController() {
    var vm = this;
    vm.unitTests = {count: '', percentage: '', color: 'green', error: ''};
    vm.componentTests = {count: '', percentage: '', color: 'green', error: ''};
    vm.systemTests = {count: '', percentage: '', color: 'green', error: ''};
    vm.testTypes = [vm.unitTests, vm.componentTests, vm.systemTests];

    vm.updatePercentage = updatePercentage;

    function updatePercentage() {
      var sum = 0;
      vm.testTypes.forEach(function (testType) {
        sum += +testType.count || 0;
      });
      vm.testTypes.forEach(function (testType) {
        testType.percentage = sum ? (+testType.count / sum) * 100 + '%': '';
      });
    }
  }
})();