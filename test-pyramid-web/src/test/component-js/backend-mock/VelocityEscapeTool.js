"use strict";
const escape = require('escape-html');
module.exports = function EscapeTool() {
  this.html = function(htmlString) {
    return escape(htmlString);
  };
  this.javascript = function(jsString) {
    return escape(jsString);
  };
  this.xml = function(xmlString) {
    return escape(xmlString);
  };
};