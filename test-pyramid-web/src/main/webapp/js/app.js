(function () {
  'use strict';

  angular.module('pyramid', [])
    .controller('PyramidCtrl', PyramidController);

  function PyramidController() {
    var vm = this;
    vm.unitTests = {count: '', label: '', color: 'green'};
    vm.componentTests = {count: '', label: '', color: 'green'};
    vm.systemTests = {count: '', label: '', color: 'green'};
    vm.updatePercentage = updatePercentage;

    var testTypes = [vm.unitTests, vm.componentTests, vm.systemTests];

    function updatePercentage() {
      var sum = 0;
      testTypes.forEach(function (testType) {
        sum += +testType.count || 0;
      });
      testTypes.forEach(function (testType) {
        testType.label = sum ? (+testType.count / sum) * 100 + '%': '';
        if(testType.count !== '' && isNaN(testType.count)) {
          testType.label = 'Numeric value is expected!';
        }
      });
    }
  }
})();