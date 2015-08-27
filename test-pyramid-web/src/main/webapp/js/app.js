(function () {
  'use strict';

  angular.module('pyramid', [])
    .controller('PyramidCtrl', ['$http', PyramidController]);

  function PyramidController($http) {
    var vm = this;
    /**
     * Determines at what URL was our app deployed. Is used to concatenate links. E.g. if we're deployed at
     * {@code localhost:8080/} and want to
     * @type {String}
     */
    vm.baseUrl = null;
    vm.savedPyramids = [];
    vm.name = '';
    vm.unitTests = {count: '', label: '', color: 'green'};
    vm.componentTests = {count: '', label: '', color: 'green'};
    vm.systemTests = {count: '', label: '', color: 'green'};

    vm.updatePercentage = updatePercentage;
    vm.savePyramid = savePyramid;
    vm.initialize = initialize;

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
    function savePyramid() {
      $http.post(vm.baseUrl + '/pyramid', {
        name: vm.name,
        nOfUnitTests: vm.unitTests.count,
        nOfComponentTests: vm.componentTests.count,
        nOfSystemTests: vm.systemTests.count
      }).then(function(res) {
        vm.savedPyramids.push(res.data);
      });
    }
    function initialize(initialData) {
      vm.savedPyramids = initialData.savedPyramids;
      vm.baseUrl = initialData.baseUrl;
    }
  }
})();