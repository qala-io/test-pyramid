"use strict";
var random = require('random-ext');

function Pyramid(fields) {
  var self = this;
  fields = fields || {};
  this.name = fields.name || randomAlphanumeric(100, 1);
  this.nOfUnitTests = random.integer(100, 0);
  this.nOfComponentTests = random.integer(100, 0);
  this.nOfSystemTests = random.integer(100, 0);

  this.withSpecialSymbols = function () {
    this.name = random.restrictedString([random.CHAR_TYPE.SPECIAL], 100, 0);
    return this;
  };
  this.toString = function () {
    return JSON.stringify(this);
  };
  this.isPresentIn = function (pyramids, trimName) {
    trimName = trimName || false;
    var name = trimName ? self.name.trim() : self.name;
    var found = pyramids.filter(function (el) {
      return el.name === name
        && el.nOfComponentTests === self.nOfComponentTests
        && el.nOfSystemTests === self.nOfSystemTests
        && el.nOfUnitTests === self.nOfUnitTests;
    });
    return found.length !== 0;
  };
  this.assertIsPresentIn = function (pyramids, trimName) {
    if (!this.isPresentIn(pyramids, trimName)) {
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
Pyramid.empty = function () {
  var pyramid = new Pyramid();
  pyramid.name = null;
  pyramid.nOfUnitTests = null;
  pyramid.nOfComponentTests = null;
  pyramid.nOfSystemTests = null;
  return pyramid;
};

function randomAlphanumeric(maxBoundary, minBoundary) {
  var result = '';
  while (!result.trim()) {
    result = random.restrictedString([random.CHAR_TYPE.SPACE, random.CHAR_TYPE.LOWERCASE,
      random.CHAR_TYPE.UPPERCASE, random.CHAR_TYPE.NUMERIC], maxBoundary, minBoundary);
  }
  return result;
}

module.exports = Pyramid;