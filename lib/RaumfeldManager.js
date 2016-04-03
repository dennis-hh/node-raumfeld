var SsdpClient = require("node-ssdp").Client;
var UpnpClient = require('upnp-device-client');
var util = require("util");
var Q = require('q');
var EventEmitter = require("events").EventEmitter;
var log = require('loglevel');
var RaumfeldRenderer = require("./RaumfeldRenderer");
var RaumfeldVirtualRenderer = require("./RaumfeldVirtualRenderer");
var RaumfeldMediaServer = require("./RaumfeldMediaServer");

var VIRTUAL_RENDERER = "Virtual Media Player";

function RaumfeldManager() {
    EventEmitter.call(this);
    this.ssdpClient = new SsdpClient();
    this.rendererType = "all";
    var self = this;

    this.ssdpClient.on('response', function (headers, statusCode, rinfo) {
        self.createDevice(headers.LOCATION);
    });
}

util.inherits(RaumfeldManager, EventEmitter);

RaumfeldManager.prototype.createDevice = function (url) {
    var client = new UpnpClient(url);
    var self = this;
    var deferred = Q.defer();
    client.getDeviceDescription(function (err, description) {
        if (err) return deferred.reject(err);

        if (description.manufacturer != "Raumfeld GmbH") {
            return deferred.resolve(null);
        }
        log.debug("Discovered Raumfeld device: " + description.friendlyName);

        switch (description.deviceType) {
            case 'urn:schemas-upnp-org:device:MediaServer:1':
                device = self.createMediaServer(client);
                deferred.resolve(device);
                break;

            case 'urn:schemas-upnp-org:device:MediaRenderer:1':
                if (description.modelDescription == VIRTUAL_RENDERER) {
                    if(self.rendererType == "all" || self.rendererType == "virtual") {
                        device = self.createVirtualRenderer(client);
                        deferred.resolve(device);
                    }
                } else {
                    if(self.rendererType == "all" || self.rendererType == "real") {
                        device = self.createRenderer(client);
                        deferred.resolve(device);
                    }
                }
                break;

            default:
                log.info(
                    "Device " + description.friendlyName + " with type " + description.modelDescription + " is not implemented"
                );
                deferred.resolve(null);
                break;
        }
    })

    return deferred.promise;
}

RaumfeldManager.prototype.createVirtualRenderer = function (client) {
    var device = new RaumfeldVirtualRenderer(client);
    this.emit("rendererFound", device);
    log.debug("Created renderer " + device.name);

    return device;
}

RaumfeldManager.prototype.createRenderer = function (client) {
    var device = new RaumfeldRenderer(client);
    this.emit("rendererFound", device);
    log.debug("Created renderer " + device.name);

    return device;
}

RaumfeldManager.prototype.createMediaServer = function (client) {
    var device = new RaumfeldMediaServer(client);
    this.emit("mediaServerFound", device);
    log.debug("Created media server");

    return device;
}

RaumfeldManager.prototype.discover = function (rendererType) {
    var self = this;
    if(!rendererType) {
        rendererType = "all";
    }
    this.rendererType = rendererType;
    var sendDiscover = function() {
        log.info("Discovering Raumfeld devices");
        self.ssdpClient.search('urn:schemas-upnp-org:device:MediaServer:1');
        self.ssdpClient.search('urn:schemas-upnp-org:device:MediaRenderer:1');
        //setTimeout(sendDiscover, 10000);
    }

    sendDiscover();
}

module.exports = RaumfeldManager;
