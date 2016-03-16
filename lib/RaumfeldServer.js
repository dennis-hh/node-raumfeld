var log = require('loglevel');
var utils = require("./utils");

function RaumfeldServer(client) {
    this.client = client;
    this.name = client.deviceDescription.friendlyName;
}

module.exports = RaumfeldServer;
