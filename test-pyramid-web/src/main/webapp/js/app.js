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
    vm.nameErrorMsg = '';
    vm.testTypes = [
      {id: 'unit-tests', title: 'Unit Tests', count: '', label: '', color: 'green'},
      {id: 'component-tests', title: 'Component Tests', count: '', label: '', color: 'green'},
      {id: 'system-tests', title: 'System Tests', count: '', label: '', color: 'green'}];
    // METHODS
    vm.updatePercentage = updatePercentage;
    vm.savePyramid = savePyramid;
    vm.initialize = initialize;
    /**
     * Needed only for testing.
     * @type {testType}
     */
    this.testType = testType;

    // FUNCTIONS
    function updatePercentage() {
      var sum = 0;
      vm.testTypes.forEach(function (testType) {
        sum += +testType.count || 0;
      });
      vm.testTypes.forEach(function (testType) {
        testType.label = sum ? (+((+testType.count / sum) * 100).toFixed(1)) + '%' : '';
      });
    }

    function savePyramid() {
      $http.post(vm.baseUrl + '/pyramid', {
        name: vm.name,
        nOfUnitTests: vm.testTypes[0].count,
        nOfComponentTests: vm.testTypes[1].count,
        nOfSystemTests: vm.testTypes[2].count
      }).then(function (res) {
        vm.savedPyramids.push(res.data);
      }).catch(function (error) {
        console.warn(error);
      });
    }

    function testType(testType) {
      for (var i = 0; i < vm.testTypes.length; i++) {
        if (vm.testTypes[i].id === testType) {
          return vm.testTypes[i];
        }
      }
      throw new Error('Could not find test type: ' + testType);
    }

    function initialize(initialData) {
      vm.savedPyramids = initialData.savedPyramids;
      vm.baseUrl = initialData.baseUrl;
    }
  }
})();