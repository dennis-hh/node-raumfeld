var SsdpClient = require("node-ssdp").Client;
var UpnpClient = require('upnp-device-client');
var log = require('loglevel');
var RaumfeldRenderer = require("./RaumfeldRenderer");
var RaumfeldVirtualRenderer = require("./RaumfeldVirtualRenderer");

function RaumfeldManager() {
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
        if (description.manufacturer == "Raumfeld GmbH") {
            log.info("Found Raumfeld device: " + description.friendlyName);

            var existing = self.renderers.some(function (renderer) {
                if (renderer.name == description.friendlyName) {
                    return true;
                }
            });

            if (!existing) {
                if (description.modelDescription == "Virtual Media Player") {
                    self.renderers.push(new RaumfeldVirtualRenderer(client));
                } else {
                    self.renderers.push(new RaumfeldRenderer(client));
                }
            }
        }
    })
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

RaumfeldManager.prototype.discover = function () {
    log.info("Discovering Raumfeld devices");
    this.ssdpClient.search('urn:schemas-upnp-org:device:MediaRenderer:1');
}

module.exports = RaumfeldManager;