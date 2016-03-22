var RaumfeldRenderer = require("./RaumfeldRenderer");
var log = require('loglevel');
var util = require("util");
var utils = require("./utils");

function RaumfeldVirtualRenderer(client) {
    RaumfeldVirtualRenderer.super_.call(this, client);
}

util.inherits(RaumfeldVirtualRenderer, RaumfeldRenderer);

RaumfeldVirtualRenderer.prototype.getMediaInfo = function () {
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

/*RaumfeldVirtualRenderer.prototype.loadUri = function (uri) {
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

module.exports = RaumfeldVirtualRenderer;
