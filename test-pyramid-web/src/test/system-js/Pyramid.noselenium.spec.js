"use strict";

describe('PyramidController', function () {
  let sut;

  /**
   * In reality this should check all the saving and retrieving of the data to/from real BE.
   * But currently in this project there is no retrieval of pyramids over AJAX (initial page
   * is generated on server). So leaving this as a demonstration.
   */
  it('saves project to BE', function (done) {
    sut.currentPyramid.name = 'blah';
    sut.currentPyramid.unitTests.count = 10;
    sut.currentPyramid.componentTests.count = 5;
    sut.currentPyramid.systemTests.count = 5;
    sut.savePyramid().then(function() {
      expect(sut.savedPyramids[0]).toBeDefined();
      done();
    });
  });


  /**
   * Older versions of Karma don't allow real HTTP interactions easy. Don't know if this is fixed in newer versions,
   * had to introduce a lot of crappy code below to make it work.
   */
  angular.mock.http = {};
  angular.mock.http.init = function() {
    angular.module('ngMock', ['ng', 'ngMockE2E']).provider({
      $exceptionHandler: angular.mock.$ExceptionHandlerProvider,
      $log: angular.mock.$LogProvider,
      $interval: angular.mock.$IntervalProvider,
      $rootElement: angular.mock.$RootElementProvider
    }).config(['$provide', function($provide) {
      $provide.decorator('$timeout', angular.mock.$TimeoutDecorator);
      $provide.decorator('$$rAF', angular.mock.$RAFDecorator);
      // From version 1.4.3 this line is removed. Uncomment for older versions.
      // $provide.decorator('$$asyncCallback', angular.mock.$AsyncCallbackDecorator);
      $provide.decorator('$rootScope', angular.mock.$RootScopeDecorator);
      $provide.decorator('$controller', angular.mock.$ControllerDecorator);
    }]);
  };
  angular.mock.http.reset = function() {
    angular.module('ngMock', ['ng']).provider({
      $browser: angular.mock.$BrowserProvider,
      $exceptionHandler: angular.mock.$ExceptionHandlerProvider,
      $log: angular.mock.$LogProvider,
      $interval: angular.mock.$IntervalProvider,
      $httpBackend: angular.mock.$HttpBackendProvider,
      $rootElement: angular.mock.$RootElementProvider
    }).config(['$provide', function($provide) {
      $provide.decorator('$timeout', angular.mock.$TimeoutDecorator);
      $provide.decorator('$$rAF', angular.mock.$RAFDecorator);
      // From version 1.4.3 this line is removed. Uncomment for older versions.
      // $provide.decorator('$$asyncCallback', angular.mock.$AsyncCallbackDecorator);
      // $provide.decorator('$rootScope', angular.mock.$RootScopeDecorator);
      $provide.decorator('$controller', angular.mock.$ControllerDecorator);
    }]);
  };
  beforeEach(angular.mock.http.init);
  afterEach(angular.mock.http.reset);

  beforeEach(angular.mock.module('app.pyramid'));
  beforeEach(angular.mock.inject(function (_$controller_, _$httpBackend_) {
    _$httpBackend_.whenPOST(/.*/).passThrough();
    _$httpBackend_.whenGET(/.*/).passThrough();
    sut = _$controller_('PyramidCtrl', {$scope: {}});
    sut.baseUrl = 'http://localhost:8080';
  }));
});