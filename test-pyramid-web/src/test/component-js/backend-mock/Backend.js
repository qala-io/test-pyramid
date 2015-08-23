var vm = require("velocity");
var SpringMacroContext = require('./SpringVelocityMacroContext');
var springMacroContext = new SpringMacroContext();

var path = require("path");
var express = require('express');

var app = express();

module.exports = function Backend() {
  this.init = function () {
    app.engine('vm', velocityExpressEngine({
      root: 'src/main/webapp/WEB-INF/velocity/'  //duplicated with views setting but required for velocity template
    }));
    app.set('views', 'src/main/webapp/WEB-INF/velocity/');

    app.use('/vendor', express.static('src/main/webapp/vendor'));
    app.use('/js', express.static('src/main/webapp/js'));
    app.use('/css', express.static('src/main/webapp/css'));

    app.get('/', function (req, res) {
      res.render('index.html.vm');
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