var random = require('random-strings').random;

var moreThanZero = function() {
  var alphabet = '123456789';
  var nOfDigits = random(1, '123');
  return +random(nOfDigits, alphabet);
};

exports.moreThanZero = moreThanZero;