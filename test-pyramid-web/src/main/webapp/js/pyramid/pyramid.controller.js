(function () {
  "use strict";
  angular.module('app.pyramid')
    .controller('PyramidCtrl', ['$http', '$scope', 'pyramidCanvas', 'canvasSize', '$location', PyramidController]);

  function PyramidController($http, $scope, pyramidCanvas, canvasSize, $location) {
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
    vm.currentPyramid = new Pyramid();
    vm.canvasSize = canvasSize;
    // METHODS
    vm.initialize = initialize;
    vm.updatePercentage = updatePercentage;
    vm.savePyramid = savePyramid;
    vm.showForm = showForm;
    vm.draw = draw;
    vm.testType = testType;
    vm.cancelEditing = cancelEditing;

    // FUNCTIONS
    function updatePercentage() {
      var proportions = this.currentPyramid.updateProportions();
      pyramidCanvas.draw(proportions);
    }

    function showForm() {
      $scope.newPyramidForm.$setPristine();
      vm.view = 'form';
    }

    function showList() {
      vm.view = 'list';
    }

    function cancelEditing() {
      vm.currentPyramid = new Pyramid();
      showList();
    }

    function draw(pyramidIndex) {
      var proportions = vm.savedPyramids[pyramidIndex].updateProportions();
      vm.savedPyramids.forEach(function (el) {
        el.highlight = false;
      });
      vm.savedPyramids[pyramidIndex].highlight = true;
      pyramidCanvas.draw(proportions);
    }

    function savePyramid() {
      $http.post(vm.baseUrl + '/pyramid', vm.currentPyramid.toServerJson()).then(function (res) {
        vm.savedPyramids.forEach(function (el) {
          el.highlight = false;
        });
        var pyramid = new Pyramid(res.data);
        vm.savedPyramids.push(pyramid);
        pyramid.highlight = true;
        showList();
      }).catch(function (error) {
        console.warn(error);
      });
    }

    function highlightAndDraw(pyramid) {
      pyramid.highlight = true;

    }

    /**
     * Returns test info by its test-type id.
     * @param testType string id of test-type (see {@see vm.testTypes})
     * @returns {*}
     */
    function testType(testType) {
      for (var i = 0; i < vm.testTypes.length; i++) {
        if (vm.testTypes[i].id === testType) {
          return vm.testTypes[i];
        }
      }
      throw new Error('Could not find test type: ' + testType);
    }

    function initialize(initialData) {
      vm.savedPyramids = Pyramid.fromServerList(initialData.savedPyramids);
      vm.baseUrl = initialData.baseUrl;
      vm.experimentalFeaturesOn = $location && !!$location.search().experimental;
    }
  }

  function Pyramid(fromPyramid) {
    var self = this;
    fromPyramid = fromPyramid || {};
    this.name = fromPyramid.name || '';
    this.unitTests = {count: fromPyramid.nOfUnitTests || '', title: 'Unit Tests', id: 'unit-tests', label: ''};
    this.componentTests = {count: fromPyramid.nOfComponentTests || '', title: 'Component Tests', id: 'component-tests', label: ''};
    this.systemTests = {count: fromPyramid.nOfSystemTests || '', title: 'System Tests', id: 'system-tests', label: ''};
    this.tests = [this.systemTests, this.componentTests, this.unitTests];

    this.updateProportions = updateProportions;
    this.toServerJson = toServerJson;

    function updateProportions() {
      var sum = self.tests.reduce(function (prevValue, it) {
        return prevValue + (+it.count || 0);
      }, 0);
      self.tests.forEach(function (it) {
        it.proportion = sum ? it.count / sum : 0;
        if (!it.count || isNaN(it.count)) {
          it.label = '';
        } else {
          it.label = +(it.proportion * 100).toFixed(1) + '%';
        }
      });
      return [self.unitTests.proportion, self.componentTests.proportion, self.systemTests.proportion];
    }
    function toServerJson() {
      return {
        name: self.name,
        nOfUnitTests: self.unitTests.count,
        nOfComponentTests: self.componentTests.count,
        nOfSystemTests: self.systemTests.count
      };
    }

  }
  Pyramid.fromServerList = function (serverJson) {
    var list = [];
    serverJson.forEach(function(serverPyramid){
      list.push(new Pyramid(serverPyramid));
    });
    return list;
  };
})();