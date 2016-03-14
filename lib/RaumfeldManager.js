var RaumfeldDevice = require("./RaumfeldDevice");
var SsdpClient = require("node-ssdp").Client;
var UpnpClient = require('upnp-device-client');
var log = require('loglevel');

function RaumfeldManager() {
    this.devices = [];
    this.ssdpClient = new SsdpClient();
    var self = this;

    this.ssdpClient.on('response', function (headers, statusCode, rinfo) {
        var client = new UpnpClient(headers.LOCATION);
        client.getDeviceDescription(function(err, description) {
            if(err) throw err;
            if(description.manufacturer == "Raumfeld GmbH") {
                log.info("Found Raumfeld device: " + description.friendlyName);
                self.addDevice(new RaumfeldDevice(client));
            }
        });
    });
}

RaumfeldManager.prototype.addDevice = function(device) {
    var existing = false;
    this.devices.forEach(function(availableDevice) {
        if(availableDevice.name == device.name) {
            existing = true;
        }
    });

    if(!existing) {
        this.devices.push(
            {
                "name": device.name,
                "device": device
            }
        );
    }
}

RaumfeldManager.prototype.getDevices = function() {
    return this.devices;
}

RaumfeldManager.prototype.getDevice = function(name) {
    var device = null;
    this.devices.forEach(function(availableDevice) {
        if(availableDevice.name == name) {
            device = availableDevice.device;
        }
    });

    return device;
}

RaumfeldManager.prototype.discover = function() {
    log.info("Discovering Raumfeld devices");
    this.ssdpClient.search('urn:schemas-upnp-org:device:MediaRenderer:1');
}

module.exports = RaumfeldManager;