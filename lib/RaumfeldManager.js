var SsdpClient = require("node-ssdp").Client;
var UpnpClient = require('upnp-device-client');
var log = require('loglevel');
var RaumfeldRenderer = require("./RaumfeldRenderer");
var RaumfeldVirtualRenderer = require("./RaumfeldVirtualRenderer");
var RaumfeldMediaServer = require("./RaumfeldMediaServer");

var VIRTUAL_RENDERER = "Virtual Media Player";

function RaumfeldManager() {
    this.mediaServer = null;
    this.renderers = [];
    this.ssdpClient = new SsdpClient();
    this.onlyVirtual = false;
    var self = this;

    this.ssdpClient.on('response', function (headers, statusCode, rinfo) {
        self.addDevice(new UpnpClient(headers.LOCATION));
    });
}

RaumfeldManager.prototype.addDevice = function (client) {
    var self = this;
    client.getDeviceDescription(function (err, description) {
        if (err) throw err;

        if (description.manufacturer != "Raumfeld GmbH") {
            return;
        }
        log.debug("Discovered Raumfeld device: " + description.friendlyName);

        switch (description.deviceType) {
            case 'urn:schemas-upnp-org:device:MediaServer:1':
                self.addMediaServer(client);
                break;

            case 'urn:schemas-upnp-org:device:MediaRenderer:1':
                if (description.modelDescription == VIRTUAL_RENDERER) {
                    self.addVirtualRenderer(client);
                } else {
                    if(!self.onlyVirtual) {
                        self.addRenderer(client);
                    }
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

RaumfeldManager.prototype.hasRenderer = function (client) {
    return this.renderers.some(function (renderer) {
        if (renderer.name == client.deviceDescription.friendlyName) {
            return true;
        }
    });
}

RaumfeldManager.prototype.addVirtualRenderer = function (client) {
    if (!this.hasRenderer(client)) {
        var renderer = new RaumfeldVirtualRenderer(client);
        this.renderers.push(renderer);
        log.debug("Added " + renderer.name + " to renderers");
    }
}

RaumfeldManager.prototype.addRenderer = function (client) {
    if (!this.hasRenderer(client)) {
        var renderer = new RaumfeldRenderer(client);
        this.renderers.push(renderer);
        log.debug("Added " + renderer.name + " to renderers");
    }
}


RaumfeldManager.prototype.getRenderers = function () {
    return this.renderers;
}

RaumfeldManager.prototype.getRenderer = function (name) {
    var renderer = null;
    this.renderers.some(function (availableRenderer) {
        if (availableRenderer.name == name) {
            renderer = availableRenderer;

            return true;
        }
    });

    return renderer;
}

RaumfeldManager.prototype.addMediaServer = function (client) {
    this.mediaServer = new RaumfeldMediaServer(client);
    log.debug("Added media server");
}

RaumfeldManager.prototype.getMediaServer = function () {
    return this.mediaServer;
}


RaumfeldManager.prototype.discover = function (onlyVirtual) {
    this.onlyVirtual = onlyVirtual;
    log.info("Discovering Raumfeld devices");
    this.ssdpClient.search('urn:schemas-upnp-org:device:MediaServer:1');
    this.ssdpClient.search('urn:schemas-upnp-org:device:MediaRenderer:1');
}

module.exports = RaumfeldManager;
