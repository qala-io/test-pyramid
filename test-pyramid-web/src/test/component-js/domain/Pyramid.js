"use strict";
var random = require('random-ext');

function Pyramid() {
  var self = this;
  this.name = random.string(40, 1);
  this.nOfUnitTests = random.integer(100, 0);
  this.nOfComponentTests = random.integer(100, 0);
  this.nOfSystemTests = random.integer(100, 0);

  this.toString = function () {
    return JSON.stringify(this);
  };
  this.isPresentIn = function (pyramids) {
    var found = pyramids.filter(function (el) {
      return el.name === self.name
        && el.nOfComponentTests === self.nOfComponentTests
        && el.nOfSystemTests === self.nOfSystemTests
        && el.nOfUnitTests === self.nOfUnitTests;
    });
    return found.length !== 0;
  };
  this.assertIsPresentIn = function (pyramids) {
    if (!this.isPresentIn(pyramids)) {
      throw new Error('Could not find a pyramid ' + self + ' in the list: [' + pyramids + ']')
    }
  };
}

Pyramid.fromJson = function (json) {
  var obj = json;
  if (typeof json === String) {
    obj = JSON.parse(json);
  }
  var pyramid = new Pyramid();
  pyramid.name = obj.name;
  pyramid.nOfUnitTests = +obj.nOfUnitTests;
  pyramid.nOfComponentTests = +obj.nOfComponentTests;
  pyramid.nOfSystemTests = +obj.nOfSystemTests;
  return pyramid;
};
Pyramid.empty = function() {
  var pyramid = new Pyramid();
  pyramid.name = null;
  pyramid.nOfUnitTests = null;
  pyramid.nOfComponentTests = null;
  pyramid.nOfSystemTests = null;
  return pyramid;
};

module.exports = Pyramid;