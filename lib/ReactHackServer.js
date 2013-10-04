var express = require('express');
var React = require('React');

var _routes = null;

var PLACEHOLDER_REGEX = '<div id=[\'"]react-root[\'"]>[\\s\\S]*?</div>';

function renderReactPage(
    indexSource,
    component,
    request,
    response) {
  var routeParams = request.params;

  if (indexSource.search(new RegExp(PLACEHOLDER_REGEX)) === -1) {
    throw new Error(
      'The string <div id="react-root"> must be in your page source'
    );
  }

  React.renderComponentToString(
    component({routeParams: routeParams}),
    function(markup) {
      var pageSource = indexSource.replace(
        new RegExp(PLACEHOLDER_REGEX),
        '<div id="react-root">' + markup + '</div>'
      );
      response.setHeader('Content-type', 'text/html');
      response.setHeader('Content-length', pageSource.length);
      response.end(pageSource);
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

  createServer: function(indexSource) {
    var server = express();

    // TODO: relative paths to static resources don't work out of the box
    // TODO: 404 handlers don't work
    // TODO: enforce that you must use pushState client-side to use ReactHack

    for (var route in _routes) {
      if (!_routes.hasOwnProperty(route)) {
        continue;
      }
      var component = _routes[route];
      server.get(
        '/' + route,
        renderReactPage.bind(null, indexSource, component)
      );
    }
    return server;
  }
};

module.exports = ReactHackServer;