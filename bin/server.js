#!/usr/bin/env node

var argv = require('optimist').argv;
var fs = require('fs');
var ReactHack = require('ReactHack');

require(argv._[0]);

var indexSource = fs.readFileSync(argv.index, {encoding: 'utf8'});
var server = ReactHack.createServer(indexSource);

var bundleSrc = fs.readFileSync(argv.bundle, {encoding: 'utf8'});

server.get(argv.bundle_url, function(request, response) {
  response.setHeader('Content-type', 'text/javascript');
  response.setHeader('Content-length', bundleSrc.length);
  response.end(bundleSrc);
});

server.listen(argv.port);