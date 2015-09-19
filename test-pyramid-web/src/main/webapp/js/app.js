(function () {
  'use strict';

  angular.module('pyramid', [])
    .value('canvasSize', {height: 150, width: 150})
    .config(function ($locationProvider) { $locationProvider.html5Mode({enabled: true, requireBase: false}) })
    .controller('PyramidCtrl', ['$http', 'pyramidCanvas', 'canvasSize', '$location', PyramidController])
    .factory('pyramidCanvas', ['$document', 'canvasSize', PyramidCanvas]);

  function PyramidController($http, pyramidCanvas, canvasSize, $location) {
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
    vm.canvasSize = canvasSize;
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
      pyramidCanvas.draw(percents);
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

  function PyramidCanvas($document, canvasSize) {
    return new function () {
      var self = this;
      this.draw = draw;
      this.canvasLength = canvasSize.width;
      this.canvasHeight = canvasSize.height;
      //for testing
      this.getUnitTestsArea = getUnitTestsArea;
      this.getComponentTestsArea = getComponentTestsArea;
      this.getSystemTestsArea = getSystemTestsArea;

      function draw(testPercents) {
        var length = self.canvasLength;
        var height = self.canvasHeight;
        var canvasEl = $document.find('canvas');
        if (!canvasEl.length || !canvasEl[0].getContext) {
          console.warn('No context is available in canvas: ' + canvasEl);
          return;
        }
        var ctx = canvasEl[0].getContext('2d');
        ctx.fillStyle = 'rgb(10, 100, 100)';
        ctx.clearRect(0, 0, length, height);
        ctx.fill(getUnitTestsArea(testPercents[0], testPercents[1], testPercents[2]).toCanvasPath());
        ctx.fill(getComponentTestsArea(testPercents[0], testPercents[1], testPercents[2]).toCanvasPath());
        ctx.fill(getSystemTestsArea(testPercents[0], testPercents[1], testPercents[2]).toCanvasPath());
      }

      function getUnitTestsArea(unitProportion, componentProportion, systemProportion) {
        var area = new CanvasArea();
        if (!unitProportion) {
          return area;
        }
        var length = self.canvasLength;
        var bottomHeight = self.canvasHeight;
        var topHeight = self.canvasHeight * 0.666;
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
        } else if (systemProportion && unitProportion &&
          greaterOrEqual(componentProportion, systemProportion) && greaterOrEqual(componentProportion, unitProportion)) {
          area.points.push(
            {x: (0.5 + topTestsProportion / 2) * length, y: topHeight},
            {x: (0.5 - topTestsProportion / 2) * length, y: topHeight}
          );
        } else {
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
        var unitArea = getUnitTestsArea(unitProportion, componentProportion, systemProportion);
        var systemArea = getSystemTestsArea(unitProportion, componentProportion, systemProportion);

        var length = self.canvasLength;
        var bottomHeight = self.canvasHeight * 0.666;
        var topHeight = self.canvasHeight * 0.333;

        if (greaterOrEqual(componentProportion, unitProportion) && greaterOrEqual(componentProportion, systemProportion)) {

        }

        if (!unitArea && !greaterOrEqual(componentProportion, systemProportion)) {
          area.push({x: 0.5 * length, y: bottomHeight});
        } else if (unitArea.points.length === 0 && greaterOrEqual(componentProportion, systemProportion)) {
          area.push(
            {x: (0.5 - componentProportion / 2) * length, y: bottomHeight},
            {x: (0.5 + componentProportion / 2) * length, y: bottomHeight});
        } else {
          for (var i = unitArea.points.length - 1; i >= 0; i--) {
            var point = unitArea.points[i];
            equal(unitArea.points[i].y, bottomHeight) && area.push(point);
          }
        }

        if (!systemProportion && !greaterOrEqual(componentProportion, unitProportion)) {
          area.push({x: 0.5 * length, y: topHeight});
        } else if (!systemProportion && greaterOrEqual(componentProportion, unitProportion)) {
          area.push(
            {x: (0.5 + componentProportion / 2) * length, y: topHeight},
            {x: (0.5 - componentProportion / 2) * length, y: topHeight});
        } else {
          for (i = systemArea.points.length - 1; i >= 0; i--) {
            point = systemArea.points[i];
            equal(point.y, topHeight) && area.push(point);
          }
        }
        return area;
      }

      function getSystemTestsArea(unitProportion, componentProportion, systemProportion) {
        var bottomHeight = self.canvasHeight * 0.333;
        var topHeight = 0;
        var area = new CanvasArea();
        // logic is the same as unit tests, so getting unit area and then updating y's to system's height
        var flippedArea = getUnitTestsArea(systemProportion, componentProportion, unitProportion);
        for (var i = flippedArea.points.length - 1; i >= 0; i--) {
          var point = flippedArea.points[i];
          if (equal(point.y, self.canvasHeight)) {
            area.push({x: point.x, y: topHeight});
          } else {
            area.push({x: point.x, y: bottomHeight});
          }
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
      for (var i = 0; i < arguments.length; i++) {
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