var express = require('express');
var React = require('React');

var _routes = null;

var PLACEHOLDER_REGEX = '<div id=[\'"]react-root[\'"]>.*?</div>';

function renderReactPage(
    indexSource,
    bundleSrc,
    component,
    request,
    response) {
  var routeParams = request.params;

  if (indexSource.search(PLACEHOLDER_REGEX) === -1) {
    throw new Error(
      'The string <div id="react-root"> must be in your page source'
    );
  }

  if (indexSource.indexOf('</body>') === -1) {
    throw new Error(
      'The string </body> must be in your page source'
    );
  }

  React.renderComponentToString(
    component({routeParams: routeParams}),
    function(markup) {
      var pageSource = indexSource.replace(
        new RegExp(PLACEHOLDER_REGEX),
        '<div id="react-root">' + markup + '</div>'
      );
      pageSource = pageSource.replace(
        '</body>',
        '<script src="' + bundleSrc + '" type="text/javascript"></script>'
      );
      response.setHeader('Content-type', 'text/html');
      response.setHeader('Content-length', pageSource.length);
      response.end(pageSource.length);
    }
  );
}

var ReactHackServer = {
  start: function(routes) {
    if (_routes) {
      throw new Error('Already started ReactHack');
    }
    _routes = routes;
  },

  createServer: function(indexSource, bundleSrc) {
    var server = express();

    for (var route in _routes) {
      if (!_routes.hasOwnProperty(route)) {
        continue;
      }
      var component = _routes[route];
      app.get(
        route,
        renderReactPage.bind(null, indexSource, bundleSrc, component)
      );
    }
    return app;
  }
};

module.exports = ReactHackServer;