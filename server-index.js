var FetchingMixin = require('./lib/FetchingMixin');
var ReactHackServer = require('./lib/ReactHackServer');

ReactHackServer.FetchingMixin = FetchingMixin;

require('node-jsx').install();

module.exports = ReactHackServer;