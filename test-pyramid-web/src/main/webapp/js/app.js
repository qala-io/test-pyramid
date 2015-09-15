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
      vm.testTypes.forEach(function (testType) {
        sum += +testType.count || 0;
      });
      vm.testTypes.forEach(function (testType) {
        var count = +testType.count;
        if (isNaN(count)) {
          testType.label = '';
        } else {
          testType.label = sum ? (+(count / sum * 100).toFixed(1)) + '%' : '';
        }
      });
      vm.experimentalFeaturesOn && pyramidCanvas.draw();
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

      function draw() {
        var testPercents = [0.5, 0.3, 0.1];
        var canvasLength = 150;
        var canvasEl = $document.find('canvas');
        if (!canvasEl.length && !canvasEl[0].getContext) {
          console.warn('No context is available in canvas: ' + canvas);
          return;
        }
        var ctx = canvasEl[0].getContext('2d');
        var path=new Path2D();
        path.moveTo((0.5 - 0.5/2) * canvasLength, 150);
        path.lineTo((0.5 + 0.5/2) * canvasLength, 150);
        path.lineTo((0.5 + 0.3/2) * canvasLength, 100);
        path.lineTo((0.5 - 0.3/2) * canvasLength, 100);
        ctx.fill(path);

        path = new Path2D();
        path.moveTo((0.5 - 0.3/2) * canvasLength, 100);
        path.lineTo((0.5 + 0.3/2) * canvasLength, 100);
        path.lineTo((0.5 + 0.1/2) * canvasLength, 50);
        path.lineTo((0.5 - 0.1/2) * canvasLength, 50);
        ctx.fillStyle = 'rgb(10, 100, 200)';
        ctx.fill(path);

        path = new Path2D();
        path.moveTo((0.5 - 0.1/2) * canvasLength, 50);
        path.lineTo((0.5 + 0.1/2) * canvasLength, 50);
        path.lineTo((0.5) * canvasLength, 0);
        ctx.fillStyle = 'rgb(100, 10, 200)';
        ctx.fill(path);
      }
    };
  }
})();