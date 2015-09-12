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
    vm.unitTests = {id: 'unit-tests', title: 'Number of Unit Tests', count: '', label: '', color: 'green'};
    vm.componentTests = {id: 'component-tests', title: 'Number of Component Tests', count: '', label: '', color: 'green'};
    vm.systemTests = {id: 'system-tests', title: 'Number of System Tests', count: '', label: '', color: 'green'};
    /**
     * Is set to true only when the pyramid is valid - name is specified and at least one test count is set.
     * @type {boolean}
     */
    vm.valid = false;

    vm.updatePercentage = updatePercentage;
    vm.savePyramid = savePyramid;
    vm.initialize = initialize;

    vm.testTypes = [vm.unitTests, vm.componentTests, vm.systemTests];

    function updatePercentage() {
      var pyramidIsValid = true;
      var sum = 0;
      vm.testTypes.forEach(function (testType) {
        sum += +testType.count || 0;
      });
      vm.testTypes.forEach(function (testType) {
        testType.label = sum ? (+((+testType.count / sum) * 100).toFixed(1)) + '%' : '';
        if (testType.count !== '' && isNaN(testType.count)) {
          testType.label = 'Numeric value is expected!';
          pyramidIsValid = false;
        }
      });
      vm.valid = pyramidIsValid && isNameValid(vm.name);
    }

    function isNameValid(name) {
      name = name || '';
      return name.length > 0 && name.length <= 100;
    }

    function savePyramid() {
      if (!vm.valid) {
        throw new Error('Save was invoked while the Pyramid was not actually valid. ' +
                        'This is a bug or someone is playing with the page.');
      }
      $http.post(vm.baseUrl + '/pyramid', {
        name: vm.name,
        nOfUnitTests: vm.unitTests.count,
        nOfComponentTests: vm.componentTests.count,
        nOfSystemTests: vm.systemTests.count
      }).then(function (res) {
        vm.savedPyramids.push(res.data);
      });
    }

    function initialize(initialData) {
      vm.savedPyramids = initialData.savedPyramids;
      vm.baseUrl = initialData.baseUrl;
    }
  }
})();