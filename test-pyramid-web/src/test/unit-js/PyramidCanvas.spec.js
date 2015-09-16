'use strict';
var moreThanZero = require('./utils').moreThanZero;
var alphabetic = require('./utils').alphabetic;

describe('PyramidCanvas', function () {
  var sut;
  beforeEach(angular.mock.module('pyramid'));
  beforeEach(angular.mock.module(function ($provide) {
    $provide.value("$document", null);
  }));
  beforeEach(angular.mock.inject(function (_pyramidCanvas_) {
    sut = _pyramidCanvas_;
    sut.canvasLength = 1;
    sut.canvasHeight = 1;
  }));
  it('unit tests area must be drawn correctly', function () {
    var area = sut.getUnitTestsArea(0.8, 0.2);
    expect(area.initialPoint.x).toBeCloseTo(0.1);
    expect(area.initialPoint.y).toBe(1);

    expect(area.points[0].x).toBeCloseTo(0.9);
    expect(area.points[0].y).toBe(1);

    expect(area.points[1].x).toBeCloseTo(0.6);
    expect(area.points[1].y).toBeCloseTo(0.666);

    expect(area.points[2].x).toBeCloseTo(0.4);
    expect(area.points[2].y).toBeCloseTo(0.666);
  });
  it('unit tests area must be wider in case proportion of component tests is smaller', function () {
    var area = sut.getUnitTestsArea(0.8, 0.2);
    expect(area.bottomWidth()).toBeCloseTo(0.8);
    expect(area.topWidth()).toBeCloseTo(0.2);
  });
  it('unit tests area must be wider if proportion of component tests is smaller', function () {
    var area = sut.getUnitTestsArea(0.8, 0.2);
    expect(area.bottomWidth()).toBeCloseTo(0.8);
    expect(area.topWidth()).toBeCloseTo(0.2);
  });
  it('unit tests area must be 0 at the bottom if proportion of unit tests is smaller', function () {
    var area = sut.getUnitTestsArea(0.2, 0.8);
    expect(area.bottomWidth()).toBe(0);
  });
  it('unit tests top must equal to component tests bottom if proportion of unit tests is smaller', function () {
    var area = sut.getUnitTestsArea(0.2, 0.8);
    expect(area.topWidth()).toBeCloseTo(0.8);
  });
  it('unit tests area must be squared if proportion of unit tests is equal to component tests', function () {
    var area = sut.getUnitTestsArea(0.4, 0.4);
    expect(area.bottomWidth()).toBeCloseTo(0.4);
    expect(area.topWidth()).toBeCloseTo(0.4);
  });
});