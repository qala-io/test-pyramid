'use strict';
var moreThanZero = require('./utils').moreThanZero;
var alphabetic = require('./utils').alphabetic;

describe('PyramidCanvas', function () {
  var sut;
  beforeEach(angular.mock.module('pyramid'));
  beforeEach(angular.mock.module(function($provide) {
    $provide.value("$document", null);
  }));
  beforeEach(angular.mock.inject(function (_pyramidCanvas_) {
    sut = _pyramidCanvas_;
  }));
  it('blah', function() {
    expect(sut.draw).toBeDefined();
  });
});