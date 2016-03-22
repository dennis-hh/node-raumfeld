var log = require('loglevel');
var utils = require("./utils");

function RaumfeldMediaServer(client) {
    this.client = client;
}

RaumfeldMediaServer.prototype.browse = function () {
    log.debug("Browsing media");
    return utils.deferredAction(
        this.client,
        "ContentDirectory",
        "Browse",
        {
            "ObjectID": "0/Spotify",
            "BrowseFlag": "BrowseMetadata",
            "Filter": "*",
            "StartingIndex": 0,
            "RequestedCount": 5
            //"SortCriteria":
        },
        function (result) {
            console.log(result);
            log.debug("Browsed media");
            return result;
        }
    );
}

RaumfeldMediaServer.prototype.search = function (string) {
    log.debug("Searching media for " + string);
    return utils.deferredAction(
        this.client,
        "ContentDirectory",
        "Search",
        {
            "ContainerID": "0",
            "SearchCriteria": "upnp:class derivedfrom foo",
            "Filter": "*",
            "StartingIndex": 0,
            "RequestedCount": 5
            //"SortCriteria":
        },
        function (result) {
            console.log(result);
            log.debug("Searched media for " + string);
            return result;
        }
    );
}

module.exports = RaumfeldMediaServer;
