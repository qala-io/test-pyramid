"use strict";
var random = randomExt;
var moreThanZero = function () {
  var order = random.integer(3, 1); //to increase chances of different order numbers
  return random.integer(10 * order, 1);
};
var alphabetic = function () {
  return random.restrictedString([random.CHAR_TYPE.UPPERCASE, random.CHAR_TYPE.LOWERCASE], 5, 1);
};