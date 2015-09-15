(function () {
  'use strict';

  angular.module('pyramid', [])
    .config(function ($locationProvider) { $locationProvider.html5Mode({enabled: true, requireBase: false}) })
    .controller('PyramidCtrl', ['$http', 'pyramidCanvas', '$location', PyramidController])
    .factory('pyramidCanvas', ['$document', PyramidCanvas]);

  function PyramidController($http, pyramidCanvas, $location) {
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
    vm.experimentalFeaturesOn = false;
    /**
     * Needed only for testing.
     * @type {testType}
     */
    this.testType = testType;

    // FUNCTIONS
    function updatePercentage() {
      var sum = 0;
      var percents = [];
      vm.testTypes.forEach(function (testType) {
        sum += +testType.count || 0;
      });
      vm.testTypes.forEach(function (testType) {
        var count = +testType.count;
        if (isNaN(count)) {
          percents.push(0);
          testType.label = '';
        } else {
          var proportion = (count / sum);
          percents.push(proportion);
          testType.label = sum ? +(proportion * 100).toFixed(1) + '%' : '';
        }
      });
      vm.experimentalFeaturesOn && pyramidCanvas.draw(percents);
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
      vm.experimentalFeaturesOn = $location && !!$location.search().experimental;
    }
  }

  function PyramidCanvas($document) {
    return new function () {
      this.draw = draw;
      var canvasLength = 150;
      var canvasHeight = 150;
      //for testing
      this.getUnitTestsArea = getUnitTestsArea;

      function draw(testPercents) {
        var canvasEl = $document.find('canvas');
        if (!canvasEl.length || !canvasEl[0].getContext) {
          console.warn('No context is available in canvas: ' + canvas);
          return;
        }
        var ctx = canvasEl[0].getContext('2d');
        ctx.clearRect(0, 0, canvasLength, canvasHeight);
        ctx.fill(getUnitTestsArea(testPercents[0], testPercents[1]).toCanvasPath());

        ctx.fillStyle = 'rgb(10, 100, 100)';
        ctx.fill(getComponentTestsArea(testPercents[1], testPercents[2]).toCanvasPath());

        ctx.fillStyle = 'rgb(100, 10, 200)';
        ctx.fill(getSystemTestsArea(testPercents[1], testPercents[2]).toCanvasPath());
      }

      function getUnitTestsArea(unitProportion, componentProportion) {
        var area = new CanvasArea();
        if (unitProportion > componentProportion) {
          area.initialPoint = {x: (0.5 - unitProportion / 2) * canvasLength, y: canvasHeight};
          area.points.push(
            {x: (0.5 + unitProportion / 2) * canvasLength, y: canvasHeight},
            {x: (0.5 + componentProportion / 2) * canvasLength, y: canvasHeight - canvasHeight / 3},
            {x: (0.5 - componentProportion / 2) * canvasLength, y: canvasHeight - canvasHeight / 3}
          );
        } else if (unitProportion < componentProportion) {
          area.initialPoint = {x: 0.5 * canvasLength, y: canvasHeight};
          area.points.push(
            {x: (0.5 + componentProportion / 2) * canvasLength, y: canvasHeight - canvasHeight / 3},
            {x: (0.5 - componentProportion / 2) * canvasLength, y: canvasHeight - canvasHeight / 3}
          );
        }
        return area;
      }

      function getComponentTestsArea(componentProportion, systemProportion) {
        var area = new CanvasArea();
        area.initialPoint = {x: (0.5 - componentProportion / 2) * canvasLength, y: canvasHeight - canvasHeight / 3};
        area.points.push(
          {x: (0.5 + componentProportion / 2) * canvasLength, y: canvasHeight - canvasHeight / 3},
          {x: (0.5 + systemProportion / 2) * canvasLength, y: canvasHeight - canvasHeight / 3 * 2},
          {x: (0.5 - systemProportion / 2) * canvasLength, y: canvasHeight - canvasHeight / 3 * 2}
        );
        return area;
      }

      function getSystemTestsArea(componentProportion, systemProportion) {
        var area = new CanvasArea();
        area.initialPoint = {x: (0.5 - systemProportion / 2) * canvasLength, y: canvasHeight - canvasHeight / 3 * 2};
        area.points.push({x: (0.5 + systemProportion / 2) * canvasLength, y: canvasHeight - canvasHeight / 3 * 2});
        if (componentProportion > systemProportion) {
          area.points.push({x: (0.5) * canvasLength, y: 0});
        } else {
          area.points.push(
            {x: (0.5 + systemProportion / 2) * canvasLength, y: 0},
            {x: (0.5 - systemProportion / 2) * canvasLength, y: 0}
          );
        }
        return area;
      }
    };
  }
  function CanvasArea() {
    this.initialPoint = {x: 0, y: 0};
    this.points = [];

    this.toCanvasPath = function() {
      var path = new Path2D();
      path.moveTo(this.initialPoint.x, this.initialPoint.y);
      this.points.forEach(function(point) {
        path.lineTo(point.x, point.y);
      });
      return path;
    }
  }
})();