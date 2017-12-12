"use strict";

const vm = require("velocity");
const SpringMacroContext = require('./SpringVelocityMacroContext');
const springMacroContext = new SpringMacroContext();

const path = require("path");
const url = require('url');
const express = require('express');
const bodyParser = require('body-parser');
const Pyramid = require('../domain/Pyramid');
const VelocityEscapeTool = require('./VelocityEscapeTool');

const app = express();

/** Global collection of pyramids */

module.exports = function Backend(rootSrcDir) {
  const self = this;
  self.pyramids = [];
  self.webappDir = path.join(rootSrcDir || '.', 'src/main/webapp');

  self.assertContainsPyramid = function (pyramid) {
    browser.wait(function () {
      return pyramid.isPresentIn(self.pyramids);
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
    const app = initWebApp(self.webappDir);

    app.use('/favicon.ico', express.static(path.join(self.webappDir, 'favicon.ico')));
    app.use('/vendor', express.static(path.join(self.webappDir, 'vendor')));
    app.use('/js', express.static(path.join(self.webappDir, 'js')));
    app.use('/css', express.static(path.join(self.webappDir, 'css')));

    app.get('/', function (req, res) {
      res.render('index.html.vm', {savedPyramids: JSON.stringify(self.pyramids)});
    });
    app.post('/pyramid', function (req, res) {
      const pyramid = Pyramid.fromJson(req.body);
      self.addPyramid(pyramid);
      res.status(200).json(pyramid);
    });

    startServer(app);
  };
};

function initWebApp(webappDir) {
  app.engine('vm', velocityExpressEngine({
    root: path.join(webappDir, 'WEB-INF/velocity/')//duplicated with views setting but required for velocity template
  }));
  app.set('views', path.join(webappDir, 'WEB-INF/velocity/'));
  app.use(bodyParser.json());
  return app;
}

function startServer(webApp) {
  let port = 8081;
  if(typeof browser !== 'undefined' && browser) { //browser comes from protractor, but a separate mock can be deployed
    port = url.parse(browser.baseUrl).port;
  }
  const server = webApp.listen(port, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.info('Backend Mock running at http://%s:%s', host, port);
    springMacroContext.host = 'localhost';
    springMacroContext.port = port;
  });
}

function velocityExpressEngine(options) {
  options = options || [];
  return function render(filename, data, callback) {
    const engine = new vm.Engine({
      template: filename,
      root: options.root || [],
      macro: __dirname + '/spring-macros-copy.vm'
    });
    data.springMacroRequestContext = springMacroContext;
    data.esc = new VelocityEscapeTool();
    callback(null, engine.render(data));
  }
}