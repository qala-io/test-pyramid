'use strict';

describe('PyramidCtrl', function() {
  var $controller;
  var $scope = {};
  beforeEach(module('pyramid'));
  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_('PyramidCtrl', {$scope: $scope});
  }));

  it('must default name to World', function(){
    expect($scope.name).toBe('World');
  });
});