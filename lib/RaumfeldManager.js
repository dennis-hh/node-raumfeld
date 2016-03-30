var SsdpClient = require("node-ssdp").Client;
var UpnpClient = require('upnp-device-client');
var util = require("util");
var EventEmitter = require("events").EventEmitter;
var log = require('loglevel');
var RaumfeldRenderer = require("./RaumfeldRenderer");
var RaumfeldVirtualRenderer = require("./RaumfeldVirtualRenderer");
var RaumfeldMediaServer = require("./RaumfeldMediaServer");

var VIRTUAL_RENDERER = "Virtual Media Player";

function RaumfeldManager() {
    EventEmitter.call(this);
    this.ssdpClient = new SsdpClient();
    this.includeVirtual = false;
    var self = this;

    this.ssdpClient.on('response', function (headers, statusCode, rinfo) {
        self.createDevice(new UpnpClient(headers.LOCATION));
    });
}

util.inherits(RaumfeldManager, EventEmitter);

RaumfeldManager.prototype.createDevice = function (client) {
    var self = this;
    client.getDeviceDescription(function (err, description) {
        if (err) throw err;

        if (description.manufacturer != "Raumfeld GmbH") {
            return;
        }
        log.debug("Discovered Raumfeld device: " + description.friendlyName);

        switch (description.deviceType) {
            case 'urn:schemas-upnp-org:device:MediaServer:1':
                self.createMediaServer(client);
                break;

            case 'urn:schemas-upnp-org:device:MediaRenderer:1':
                if (description.modelDescription == VIRTUAL_RENDERER) {
                    if(self.includeVirtual) {
                        self.createVirtualRenderer(client);
                    }
                } else {
                    self.createRenderer(client);
                }
                break;

            default:
                log.info(
                    "Device " + description.friendlyName + " with type " + description.modelDescription + " is not implemented"
                );
                break;
        }
    })
}

RaumfeldManager.prototype.createVirtualRenderer = function (client) {
    this.emit("rendererFound", new RaumfeldVirtualRenderer(client));
    log.debug("Created renderer");
}

RaumfeldManager.prototype.createRenderer = function (client) {
    this.emit("rendererFound", new RaumfeldRenderer(client));
    log.debug("Created renderer");

}

RaumfeldManager.prototype.createMediaServer = function (client) {
    this.emit("mediaServerFound", new RaumfeldMediaServer(client));
    log.debug("Created media server");
}

RaumfeldManager.prototype.discover = function (includeVirtual) {
    var self = this;
    this.includeVirtual = includeVirtual;
    var sendDiscover = function() {
        log.info("Discovering Raumfeld devices");
        self.ssdpClient.search('urn:schemas-upnp-org:device:MediaServer:1');
        self.ssdpClient.search('urn:schemas-upnp-org:device:MediaRenderer:1');
        //setTimeout(sendDiscover, 10000);
    }

    sendDiscover();
}

module.exports = RaumfeldManager;
