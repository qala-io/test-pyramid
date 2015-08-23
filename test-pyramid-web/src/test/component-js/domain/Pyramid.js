"use strict";
var random = require('random-ext');

function Pyramid() {
  this.name = random.string(40, 1);
  this.nOfUnitTests = random.integer(100, 0);
  this.nOfComponentTests = random.integer(100, 0);
  this.nOfSystemTests = random.integer(100, 0);

  this.toString = function() {
    return JSON.stringify(this);
  };
}

Pyramid.fromJson = function(json) {
  var obj = json;
  if(typeof json === String){
    obj = JSON.parse(json);
  }
  var pyramid = new Pyramid();
  pyramid.name = obj.name;
  pyramid.nOfUnitTests = +obj.nOfUnitTests;
  pyramid.nOfComponentTests = +obj.nOfComponentTests;
  pyramid.nOfSystemTests = +obj.nOfSystemTests;
  return pyramid;
};

module.exports = Pyramid;