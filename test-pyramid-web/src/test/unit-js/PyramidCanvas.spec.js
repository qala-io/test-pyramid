'use strict';
//moreThanZero = require('./utils').moreThanZero;
//var alphabetic = require('./utils').alphabetic;

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
  it('unit tests dots must be drawn correctly in straight pyramid', function () {
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
  it('unit tests must taper at the top if proportion of component tests is smaller', function () {
    var area = sut.getUnitTestsArea(0.8, 0.2, 0.1);
    expect(area.bottomWidth()).toBeCloseTo(0.8);
    expect(area.topWidth()).toBeCloseTo(0.2);
  });
  it('unit tests must taper at the top if there are no components and proportion of system tests is smaller', function () {
    var area = sut.getUnitTestsArea(0.8, 0, 0.1);
    expect(area.bottomWidth()).toBeCloseTo(0.8);
    expect(area.topWidth()).toBeCloseTo(0.1);
  });
  it('unit tests must taper at the bottom if proportion of component tests is larger', function () {
    var area = sut.getUnitTestsArea(0.2, 0.8, 0.1);
    expect(area.bottomWidth()).toBe(0);
    expect(area.topWidth()).toBeCloseTo(0.2);
  });
  it('unit tests must be 0 if its proportion is 0', function () {
    var area = sut.getUnitTestsArea(0, 0.2, 0.1);
    expect(area.bottomWidth()).toBe(0);
    expect(area.topWidth()).toBe(0);
  });
  it('unit tests must be squared if proportion of unit tests is equal to component tests', function () {
    var area = sut.getUnitTestsArea(0.4, 0.4, 0.1);
    expect(area.bottomWidth()).toBeCloseTo(0.4);
    expect(area.topWidth()).toBeCloseTo(0.4);
  });
  it('unit tests must be squared if its proportion is 100%', function () {
    var area = sut.getUnitTestsArea(1, 0, 0);
    expect(area.bottomWidth()).toBeCloseTo(1);
    expect(area.topWidth()).toBeCloseTo(1);
  });
  it('unit tests must taper at the bottom if components are equal to systems and their number is larger than units', function() {
    var area = sut.getUnitTestsArea(1, 2, 2);
    expect(area.bottomWidth()).toBe(0);
    expect(area.topWidth()).toBeCloseTo(1);
  });

  xit('component tests bottom must be proportional to their number in straight pyramid', function () {
    var area = sut.getComponentTestsArea(0.8, 0.2, 0.1);
    expect(area.bottomWidth()).toBeCloseTo(0.2);
  });
  xit('component tests top must be proportional to their number in reverse pyramid', function () {
    var area = sut.getComponentTestsArea(0.1, 0.2, 0.8);
    expect(area.topWidth()).toBeCloseTo(0.2);
  });
  xit('component tests top must not taper if system tests are 0 and unit tests number is the smaller than component', function () {
    var area = sut.getComponentTestsArea(0.1, 0.2, 0);
    expect(area.topWidth()).toBeCloseTo(0.2);
    expect(area.bottomWidth()).toBeCloseTo(0.1);
  });
  xit('component tests must be squared if system tests are 0 and unit tests number is the same as component', function () {
    var area = sut.getComponentTestsArea(0.2, 0.2, 0);
    expect(area.bottomWidth()).toBeCloseTo(0.2);
    expect(area.topWidth()).toBeCloseTo(0.2);
  });
  xit('components are squared if n of system and unit tests is smaller than component', function () {
    var area = sut.getComponentTestsArea(0.1, 0.4, 0.1);
    expect(area.bottomWidth()).toBeCloseTo(0.4);
    expect(area.topWidth()).toBeCloseTo(0.4);
  });
  xit('components are squared if all proportions are equal', function(){
    var area = sut.getComponentTestsArea(0.2, 0.2, 0.2);
    expect(area.topWidth()).toBeCloseTo(0.2);
    expect(area.bottomWidth()).toBeCloseTo(0.2);
  });
  xit('component tests width must be 0 if there are no such tests', function () {
    var area = sut.getComponentTestsArea(1, 0, 1);
    expect(area.topWidth()).toBe(0);
    expect(area.bottomWidth()).toBe(0);
  });
  xit('component tests must be empty if there are 0 of them and other tests are non-0 and the pyramid is straight');
  xit('component tests must be empty if there are 0 of them and other tests are non-0 and the pyramid is inverse');

  xit('ends must be squared if their proportion is equal and there are no component tests');
  xit('pyramid must taper at the top if it is a correct pyramid');
  xit('pyramid must taper at the bottom it is inverse');
});