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
    var area = sut.getUnitTestsArea(0.8, 0.2, 0.1);
    expect(area.points[0].x).toBeCloseTo(0.1);
    expect(area.points[0].y).toBe(1);

    expect(area.points[1].x).toBeCloseTo(0.9);
    expect(area.points[1].y).toBe(1);

    expect(area.points[2].x).toBeCloseTo(0.6);
    expect(area.points[2].y).toBeCloseTo(0.666);

    expect(area.points[3].x).toBeCloseTo(0.4);
    expect(area.points[3].y).toBeCloseTo(0.666);
  });
  it('unit tests area must be wider if proportion of component tests is smaller', function () {
    var area = sut.getUnitTestsArea(0.8, 0.2, 0.1);
    expect(area.bottomWidth()).toBeCloseTo(0.8);
    expect(area.topWidth()).toBeCloseTo(0.2);
  });
  it('unit tests area must be 0 at the bottom if proportion of unit tests is smaller', function () {
    var area = sut.getUnitTestsArea(0.2, 0.8, 0.1);
    expect(area.bottomWidth()).toBe(0);
  });
  it('unit tests top must equal to component tests bottom if proportion of unit tests is smaller', function () {
    var area = sut.getUnitTestsArea(0.2, 0.8, 0.1);
    expect(area.topWidth()).toBeCloseTo(0.8);
  });
  it('unit tests area must be squared if proportion of unit tests is equal to component tests', function () {
    var area = sut.getUnitTestsArea(0.4, 0.4, 0.1);
    expect(area.bottomWidth()).toBeCloseTo(0.4);
    expect(area.topWidth()).toBeCloseTo(0.4);
  });
  it('component tests bottom must be proportional to their number', function () {
    var area = sut.getComponentTestsArea(0.8, 0.2, 0.1);
    expect(area.bottomWidth()).toBeCloseTo(0.2);
  });

  it('pyramid must taper at the top if it is a correct pyramid');
  it('pyramid must taper at the bottom it is inverse');
  it('component tests must be squared if n of system and unit tests is smaller than component');

  it('component tests width must be 0 if there are no such tests', function() {
    var area = sut.getComponentTestsArea(1, 0, 1);
    expect(area.topWidth()).toBe(0);
    expect(area.bottomWidth()).toBe(0);
  });
  it('pyramid must have empty component tests if there are 0 of them and the rest is fine');
  it('inverse pyramid must have empty component tests if there are 0 of them and the rest is inverse');
  it('ends must be squared if their proportion is equal and there are no component tests');
});