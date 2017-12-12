"use strict";
const random = require('random-ext');

function Pyramid(fields) {
  const self = this;
  fields = fields || {};
  this.name = fields.name === undefined ? randomAlphanumeric(100, 1) : fields.name;
  this.unitTests = fields.unitTests === undefined ? random.integer(100, 0) : fields.unitTests;
  this.componentTests = fields.componentTests === undefined ? random.integer(100, 0) : fields.componentTests;
  this.systemTests = fields.systemTests === undefined ? random.integer(100, 0) : fields.systemTests;

  this.withSpecialSymbols = function () {
    this.name = random.restrictedString([random.CHAR_TYPE.SPECIAL], 100, 0);
    return this;
  };
  this.toString = function () {
    return JSON.stringify(this);
  };
  this.isPresentIn = function (pyramids, trimName) {
    trimName = trimName || false;
    let name = self.name;
    if(trimName){
      name = self.name.trim();
      name = name.replace(/ +/g, ' '); //In HTML multiple whitespaces are replaced with 1
    }
    const found = pyramids.filter(function (el) {
      return el.name === name
        && el.componentTests === self.componentTests
        && el.systemTests === self.systemTests
        && el.unitTests === self.unitTests;
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
  let obj = json;
  if (typeof json === String) {
    obj = JSON.parse(json);
  }
  const pyramid = new Pyramid();
  pyramid.name = obj.name;
  pyramid.unitTests = +obj.unitTests;
  pyramid.componentTests = +obj.componentTests;
  pyramid.systemTests = +obj.systemTests;
  return pyramid;
};
Pyramid.empty = function () {
  const pyramid = new Pyramid();
  pyramid.name = '';
  pyramid.unitTests = '';
  pyramid.componentTests = '';
  pyramid.systemTests = '';
  return pyramid;
};

function randomAlphanumeric(maxBoundary, minBoundary) {
  let result = '';
  while (!result.trim()) {
    result = random.restrictedString([random.CHAR_TYPE.SPACE, random.CHAR_TYPE.LOWERCASE,
      random.CHAR_TYPE.UPPERCASE, random.CHAR_TYPE.NUMERIC], maxBoundary, minBoundary);
  }
  return result;
}

module.exports = Pyramid;