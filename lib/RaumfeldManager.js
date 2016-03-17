var SsdpClient = require("node-ssdp").Client;
var UpnpClient = require('upnp-device-client');
var log = require('loglevel');
var RaumfeldRenderer = require("./RaumfeldRenderer");
var RaumfeldVirtualRenderer = require("./RaumfeldVirtualRenderer");
var RaumfeldMediaServer = require("./RaumfeldMediaServer");

var VIRTUAL_RENDERER = "Virtual Media Player";
var RENDERER = "Digital Media Player";
var MEDIA_SERVER = "Media Server";

function RaumfeldManager() {
    this.mediaServer = null;
    this.renderers = [];
    this.ssdpClient = new SsdpClient();
    var self = this;

    this.ssdpClient.on('response', function (headers, statusCode, rinfo) {
        self.addDevice(new UpnpClient(headers.LOCATION));
    });
}

RaumfeldManager.prototype.addDevice = function (client) {
    var self = this;
    client.getDeviceDescription(function (err, description) {
        if (err) throw err;

        if (!description.manufacturer == "Raumfeld GmbH") {
            return;
        }
        log.info("Found Raumfeld device: " + description.friendlyName);

        switch (description.modelDescription) {
            case VIRTUAL_RENDERER:
                self.addVirtualRenderer(client);
                break;
            case RENDERER:
                self.addRenderer(client);
                break;
            case MEDIA_SERVER:
                self.addMediaServer(client);
                break;
            default:
                log.info(
                    "Device " + description.friendlyName + " with type " + description.modelDescription + " is not implemented"
                );
                break;
        }
    })
}

RaumfeldManager.prototype.hasRenderer = function(client)
{
    return self.renderers.some(function (renderer) {
        if (renderer.name == client.description.friendlyName) {
            return true;
        }
    });
}

RaumfeldManager.prototype.addVirtualRenderer = function (client) {

    if (!this.hasRenderer(client)) {
        this.renderers.push(new RaumfeldVirtualRenderer(client));
    }
}

RaumfeldManager.prototype.addRenderer = function (client) {

    if (!this.hasRenderer(client)) {
        this.renderers.push(new RaumfeldRenderer(client));
    }
}


RaumfeldManager.prototype.getRenderers = function () {
    return this.renderers;
}

RaumfeldManager.prototype.getRenderer = function (name) {
    var renderer = null;
    this.renderers.forEach(function (availableRenderer) {
        if (availableRenderer.name == name) {
            renderer = availableRenderer;
        }
    });

    return renderer;
}

RaumfeldManager.prototype.addMediaServer = function (client) {
    this.mediaServer = new RaumfeldMediaServer(client);
}

RaumfeldManager.prototype.getMediaServer = function () {
    return this.mediaServer;
}


RaumfeldManager.prototype.discover = function () {
    log.info("Discovering Raumfeld devices");
    this.ssdpClient.search('urn:schemas-upnp-org:device:MediaRenderer:1');
}

module.exports = RaumfeldManager;