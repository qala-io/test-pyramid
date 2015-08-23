"use strict";

module.exports = function MacroContext() {
  this.host = null;
  this.port = null;

  this.getContextPath = function () {
    return 'http://' + this.host + ':' + this.port;
  };
};