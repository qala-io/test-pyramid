(function(){
  "use strict";
  angular.module('app.pyramid')
    .controller('PyramidCtrl', ['$http', 'pyramidCanvas', 'canvasSize', '$location', PyramidController]);

  function PyramidController($http, pyramidCanvas, canvasSize, $location) {
    var vm = this;
    /**
     * Determines at what URL was our app deployed. Is used to concatenate links. E.g. if we're deployed at
     * {@code localhost:8080/} and want to
     * @type {String}
     */
    vm.baseUrl = null;
    vm.view = 'list';
    vm.savedPyramids = [];
    vm.name = '';
    vm.nameErrorMsg = '';
    vm.testTypes = [
      {id: 'system-tests', title: 'System Tests', count: '', proportion: 0, label: '', color: 'green'},
      {id: 'component-tests', title: 'Component Tests', count: '', proportion: 0, label: '', color: 'green'},
      {id: 'unit-tests', title: 'Unit Tests', count: '', proportion: 0, label: '', color: 'green'}];
    vm.canvasSize = canvasSize;
    // METHODS
    vm.updatePercentage = updatePercentage;
    vm.savePyramid = savePyramid;
    vm.initialize = initialize;
    vm.showForm = showForm;
    vm.draw = draw;
    this.testType = testType;

    // FUNCTIONS
    function updatePercentage() {
      var currentPyramid = formToPyramid();
      var proportions = updateProportions(currentPyramid);
      vm.testTypes.forEach(function (testType) {
        if (isNaN(testType.count)) {
          testType.label = '';
        } else {
          testType.label = +(testType.proportion * 100).toFixed(1) + '%';
        }
      });
      pyramidCanvas.draw(proportions);
    }

    function showForm() {
      vm.view = 'form';
    }

    function showList() {
      vm.view = 'list';
    }

    function draw(pyramid) {
      var percents = updateProportions(pyramid);
      pyramidCanvas.draw(percents);
    }

    function updateProportions(pyramid) {
      var proportions = [];
      var nOfUnitTests = +pyramid.nOfUnitTests || 0;
      var nOfComponentTests = +pyramid.nOfComponentTests || 0;
      var nOfSystemTests = +pyramid.nOfSystemTests || 0;
      var sum = nOfUnitTests + nOfComponentTests + nOfSystemTests;
      if (sum) {
        proportions.push(nOfUnitTests/sum, nOfComponentTests/sum, nOfSystemTests/sum);
      } else {
        proportions.push(0, 0, 0);
      }
      testType('unit-tests').proportion = proportions[0];
      testType('component-tests').proportion = proportions[1];
      testType('system-tests').proportion = proportions[2];
      return proportions;
    }

    function savePyramid() {
      $http.post(vm.baseUrl + '/pyramid', formToPyramid()).then(function (res) {
        vm.savedPyramids.push(res.data);
        showList();
      }).catch(function (error) {
        console.warn(error);
      });
    }

    function formToPyramid() {
      return {
        name: vm.name,
        nOfUnitTests: testType('unit-tests').count,
        nOfComponentTests: testType('component-tests').count,
        nOfSystemTests: testType('system-tests').count
      };
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
      vm.experimentalFeaturesOn = $location && !!$location.search().experimental;
    }
  }

})();