var random = require('random-ext');

var moreThanZero = function () {
  var order = random.integer(3, 1); //to increase chances of different order numbers
  return random.integer(10 * order, 1);
};

exports.moreThanZero = moreThanZero;