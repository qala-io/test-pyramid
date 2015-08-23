"use strict";

var vm = require("velocity");
var SpringMacroContext = require('./SpringVelocityMacroContext');
var springMacroContext = new SpringMacroContext();

var path = require("path");
var express = require('express');
var bodyParser = require('body-parser');
var Pyramid = require('../domain/Pyramid');

var app = express();

/** Global collection of pyramids */

module.exports = function Backend() {
  var self = this;
  self.pyramids = [];

  self.assertContainsPyramid = function (pyramid) {
    browser.wait(function () {
      var foundPyramids = self.pyramids.filter(function (it) {
        return it.name === pyramid.name
          && it.nOfUnitTests === pyramid.nOfUnitTests
          && it.nOfComponentTests === pyramid.nOfComponentTests
          && it.nOfSystemTests === pyramid.nOfSystemTests;
      });
      return foundPyramids.length !== 0;
    }, 1000).thenCatch(function (error) {
      throw new Error('Pyramid ' + pyramid + ' was not found though it was expected to be saved on back end. ' +
                      'Could not wait any longer: ' + error +
                      '. Existing pyramids were: [' + self.pyramids.join(',') + ']');
    });
  };
  self.addPyramid = function (pyramid) {
    self.pyramids.push(pyramid);
  };
  self.init = function () {
    app.engine('vm', velocityExpressEngine({
      root: 'src/main/webapp/WEB-INF/velocity/'  //duplicated with views setting but required for velocity template
    }));
    app.set('views', 'src/main/webapp/WEB-INF/velocity/');
    app.use(bodyParser.json());

    app.use('/vendor', express.static('src/main/webapp/vendor'));
    app.use('/js', express.static('src/main/webapp/js'));
    app.use('/css', express.static('src/main/webapp/css'));

    app.get('/', function (req, res) {
      res.render('index.html.vm');
    });
    app.post('/pyramid', function (req, res) {
      self.addPyramid(Pyramid.fromJson(req.body));
      res.status(200).json({});
    });

    var server = app.listen(8080, function () {
      var host = server.address().address;
      var port = server.address().port;
      console.info('Backend Mock running at http://%s:%s', host, port);
      springMacroContext.host = 'localhost';
      springMacroContext.port = port;
    });
  };
};

function velocityExpressEngine(options) {
  options = options || [];
  return function render(filename, data, callback) {
    var engine = new vm.Engine({
      template: filename,
      root: options.root || [],
      macro: __dirname + '/spring-macros-copy.vm'
    });
    data.springMacroRequestContext = springMacroContext;
    callback(null, engine.render(data));
  }
}