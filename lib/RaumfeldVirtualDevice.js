var RaumfeldDevice = require("./RaumfeldDevice");
var log = require('loglevel');
var util = require("util");
var utils = require("./utils");

function RaumfeldVirtualDevice(client) {
    this.client = client;
    this.name = client.deviceDescription.friendlyName;
}

util.inherits(RaumfeldVirtualDevice, RaumfeldDevice);

RaumfeldVirtualDevice.prototype.getMediaInfo = function () {
    var self = this;
    log.debug("Getting media info from " + this.name);
    return utils.deferredAction(
        this.client,
        "AVTransport",
        "GetMediaInfo",
        {},
        function (mediaInfo) {
            log.debug("Got media info from " + self.name + ":" + JSON.stringify(mediaInfo));
            return mediaInfo;
        }
    );
}

/*RaumfeldDevice.prototype.loadUri = function (uri) {
    var self = this;
    log.debug("Loading URI " + uri + " on " + this.name);
    return deferredAction(
        this.client,
        "AVTransport",
        "SetAVTransportURI",
        {"CurrentURI": uri},
        function () {
            log.debug("URI on " + self.name + " has been loaded");
            return true;
        }
    );
}*/

module.exports = RaumfeldVirtualDevice;
