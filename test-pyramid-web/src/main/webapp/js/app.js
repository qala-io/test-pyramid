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
      var self = this;
      this.draw = draw;
      this.canvasLength = 150;
      this.canvasHeight = 150;
      //for testing
      this.getUnitTestsArea = getUnitTestsArea;
      this.getComponentTestsArea = getComponentTestsArea;
      this.getSystemTestsArea = getSystemTestsArea;

      function draw(testPercents) {
        var length = self.canvasLength;
        var height = self.canvasHeight;
        var canvasEl = $document.find('canvas');
        if (!canvasEl.length || !canvasEl[0].getContext) {
          console.warn('No context is available in canvas: ' + canvas);
          return;
        }
        var ctx = canvasEl[0].getContext('2d');
        ctx.clearRect(0, 0, length, height);
        ctx.fill(getUnitTestsArea(testPercents[0], testPercents[1], testPercents[2]).toCanvasPath());

        ctx.fillStyle = 'rgb(10, 100, 100)';
        ctx.fill(getComponentTestsArea(testPercents[0], testPercents[1], testPercents[2]).toCanvasPath());

        ctx.fillStyle = 'rgb(100, 10, 200)';
        ctx.fill(getSystemTestsArea(testPercents[0], testPercents[1], testPercents[2]).toCanvasPath());
      }

      function getUnitTestsArea(unitProportion, componentProportion, systemProportion) {
        var area = new CanvasArea();
        if (!unitProportion) {
          return area;
        }
        var length = self.canvasLength;
        var bottomHeight = self.canvasHeight;
        var topHeight = self.canvasHeight - self.canvasHeight / 3;
        var topTestsProportion = componentProportion || systemProportion;

        if (greaterOrEqual(unitProportion, topTestsProportion)) {
          area.push(
            {x: (0.5 - unitProportion / 2) * length, y: bottomHeight},
            {x: (0.5 + unitProportion / 2) * length, y: bottomHeight});
        } else {
          area.push({x: 0.5 * length, y: bottomHeight});
        }

        if (!topTestsProportion) {
          area.points.push(
            {x: (0.5 + unitProportion / 2) * length, y: topHeight},
            {x: (0.5 - unitProportion / 2) * length, y: topHeight}
          );
        } else if (greaterOrEqual(unitProportion, topTestsProportion)) {
          area.points.push(
            {x: (0.5 + topTestsProportion / 2) * length, y: topHeight},
            {x: (0.5 - topTestsProportion / 2) * length, y: topHeight}
          );
        } else if (topTestsProportion - unitProportion > 0.01) {
          area.points.push(
            {x: (0.5 + unitProportion / 2) * length, y: topHeight},
            {x: (0.5 - unitProportion / 2) * length, y: topHeight}
          );
        }
        return area;
      }

      function getComponentTestsArea(unitProportion, componentProportion, systemProportion) {
        var area = new CanvasArea();
        if (!componentProportion) {
          return area;
        }
        var length = self.canvasLength;
        var bottomHeight = self.canvasHeight - self.canvasHeight / 3;
        var topHeight = self.canvasHeight - self.canvasHeight / 3 * 2;
        if ((!unitProportion && !systemProportion)
          || (equal(unitProportion, componentProportion) && !systemProportion)
          || (equal(systemProportion, componentProportion) && !unitProportion)
          || (equal(systemProportion, componentProportion) && (equal(unitProportion, componentProportion)))) { //just draw square if there is no overall tendency
          area.points.push(
            {x: (0.5 - componentProportion / 2) * length, y: bottomHeight},
            {x: (0.5 + componentProportion / 2) * length, y: bottomHeight},
            {x: (0.5 + componentProportion / 2) * length, y: topHeight},
            {x: (0.5 - componentProportion / 2) * length, y: topHeight}
          );
        } else if (!unitProportion) { //tapers at the bottom if no unit tests
          area.points.push(
            {x: 0.5 * length, y: bottomHeight},
            {x: (0.5 + componentProportion / 2) * length, y: topHeight},
            {x: (0.5 - componentProportion / 2) * length, y: topHeight}
          );
        } else if (!systemProportion && !equal(componentProportion, unitProportion)) { //tapers at the top if no system tests
          area.points.push(
            {x: (0.5 - componentProportion / 2) * length, y: bottomHeight},
            {x: (0.5 + componentProportion / 2) * length, y: bottomHeight},
            {x: 0.5 * length, y: topHeight}
          );
        } else if (!systemProportion) { //doesn't taper to the top since n of components == n of units
          area.points.push(
            {x: (0.5 - componentProportion / 2) * length, y: bottomHeight},
            {x: (0.5 + componentProportion / 2) * length, y: bottomHeight},
            {x: (0.5 + componentProportion / 2) * length, y: topHeight},
            {x: (0.5 - componentProportion / 2) * length, y: topHeight}
          );
        } else if (componentProportion > unitProportion && componentProportion > systemProportion) {
          area.points.push(
            {x: (0.5 - componentProportion / 2) * length, y: bottomHeight},
            {x: (0.5 + componentProportion / 2) * length, y: bottomHeight},
            {x: (0.5 + componentProportion / 2) * length, y: topHeight},
            {x: (0.5 - componentProportion / 2) * length, y: topHeight}
          )
        } else {
          if (componentProportion > unitProportion) {
            area.points.push(
              {x: (0.5 - unitProportion / 2) * length, y: bottomHeight},
              {x: (0.5 + unitProportion / 2) * length, y: bottomHeight});
          } else {
            area.points.push(
              {x: (0.5 - componentProportion / 2) * length, y: bottomHeight},
              {x: (0.5 + componentProportion / 2) * length, y: bottomHeight});
          }
          if (componentProportion > systemProportion) {
            area.points.push(
              {x: (0.5 + systemProportion / 2) * length, y: topHeight},
              {x: (0.5 - systemProportion / 2) * length, y: topHeight}
            );
          } else {
            area.points.push(
              {x: (0.5 + componentProportion / 2) * length, y: topHeight},
              {x: (0.5 - componentProportion / 2) * length, y: topHeight}
            );
          }
        }
        return area;
      }

      function getSystemTestsArea(componentProportion, systemProportion) {
        var length = self.canvasLength, height = self.canvasHeight;
        var area = new CanvasArea();
        area.points.push(
          {x: (0.5 - systemProportion / 2) * length, y: height - height / 3 * 2},
          {x: (0.5 + systemProportion / 2) * length, y: height - height / 3 * 2});
        if (componentProportion > systemProportion) {
          area.points.push({x: (0.5) * length, y: 0});
        } else {
          area.points.push(
            {x: (0.5 + componentProportion / 2) * length, y: 0},
            {x: (0.5 - componentProportion / 2) * length, y: 0}
          );
        }
        return area;
      }
    };
  }

  function CanvasArea() {
    this.points = [];

    this.push = function () {
      // Not using slice() because:
      // You should not slice on arguments because it prevents optimizations in JavaScript engines (V8 for example).
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
      for(var i = 0; i < arguments.length; i++) {
        this.points.push(arguments[i]);
      }
    };

    this.toCanvasPath = function () {
      var path = new Path2D();
      if (this.points.length === 0) {
        return path;
      }
      path.moveTo(this.points[0].x, this.points[0].y);
      for (var i = 1; i < this.points.length; i++) {
        path.lineTo(this.points[i].x, this.points[i].y);
      }
      return path;
    };
    //used by tests only
    this.bottomWidth = function () {
      if (this.points.length === 0) {
        return 0;
      } else if (this.sameHeight(this.points[0], this.points[1])) {
        return this.points[1].x - this.points[0].x;
      } else {
        return 0;
      }
    };
    this.topWidth = function () {
      if (this.points.length === 0) {
        return 0;
      } else if (this.points.length === 4 && this.sameHeight(this.points[2], this.points[3])) {
        return Math.abs(this.points[2].x - this.points[3].x);
      } else if (this.points.length === 3 && this.sameHeight(this.points[1], this.points[2])) {
        return Math.abs(this.points[1].x - this.points[2].x);
      }
      return 0;
    };
    this.sameHeight = function (point1, point2) {
      return equal(point1.y, point2.y);
    };
  }

  function equal(float1, float2) {
    return Math.abs(float1 - float2) < 0.001;
  }
  function greaterOrEqual(float1, float2) {
    return equal(float1, float2) || float1 > float2;
  }
})();