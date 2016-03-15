var SsdpClient = require("node-ssdp").Client;
var UpnpClient = require('upnp-device-client');
var log = require('loglevel');
var RaumfeldDevice = require("./RaumfeldDevice");
var RaumfeldVirtualDevice = require("./RaumfeldVirtualDevice");

function RaumfeldManager() {
    this.devices = [];
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

            var existing = self.devices.some(function (device) {
                if (device.name == description.friendlyName) {
                    return true;
                }
            });

            if (!existing) {
                if (description.modelDescription == "Virtual Media Player") {
                    self.devices.push(new RaumfeldVirtualDevice(client));
                } else {
                    self.devices.push(new RaumfeldDevice(client));
                }
            }
        }
    })
}

RaumfeldManager.prototype.getDevices = function () {
    return this.devices;
}

RaumfeldManager.prototype.getDevice = function (name) {
    var device = null;
    this.devices.forEach(function (availableDevice) {
        if (availableDevice.name == name) {
            device = availableDevice;
        }
    });

    return device;
}

RaumfeldManager.prototype.discover = function () {
    log.info("Discovering Raumfeld devices");
    this.ssdpClient.search('urn:schemas-upnp-org:device:MediaRenderer:1');
}

module.exports = RaumfeldManager;