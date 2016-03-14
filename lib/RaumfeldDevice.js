var Q = require('q');
var log = require('loglevel');

function RaumfeldDevice(client) {
    this.client = client;
    this.name = client.deviceDescription.friendlyName;
}

RaumfeldDevice.prototype.getVolume = function () {
    var self = this;
    log.debug("Getting volume of " + this.name);
    return deferredAction(
        this.client,
        "RenderingControl",
        "GetVolume",
        {"Channel": "Master"},
        function (result) {
            log.debug("Volume of " + self.name + " is " + result.CurrentVolume);
            return result.CurrentVolume;
        }
    );
}

RaumfeldDevice.prototype.setVolume = function (volume) {
    var self = this;
    log.debug("Setting volume of " + this.name + " to " + volume);
    return deferredAction(
        this.client,
        "RenderingControl",
        "SetVolume",
        {"Channel": "Master", "DesiredVolume": volume},
        function (result) {
            log.debug("Volume of " + self.name + " has been set to " + volume);
        }
    );
}

RaumfeldDevice.prototype.getMute = function () {
    var self = this;
    log.debug("Getting mute state of " + this.name);
    return deferredAction(
        this.client,
        "RenderingControl",
        "GetMute",
        {"Channel": "Master"},
        function (result) {
            log.debug(self.name + " mute state: " + result.CurrentMute);
            return result.CurrentMute;
        }
    );
}

RaumfeldDevice.prototype.mute = function () {
    var self = this;
    log.debug("Muting " + this.name);
    return deferredAction(
        this.client,
        "RenderingControl",
        "SetMute",
        {"Channel": "Master", "DesiredMute": true},
        function () {
            log.debug(self.name + " has been muted");
            return true;
        }
    );
}

RaumfeldDevice.prototype.unmute = function () {
    var self = this;
    log.debug("Unmuting " + this.name);
    return deferredAction(
        this.client,
        "RenderingControl",
        "SetMute",
        {"Channel": "Master", "DesiredMute": false},
        function () {
            log.debug(self.name + " has been unmuted");
            return true;
        }
    );
}

RaumfeldDevice.prototype.pause = function () {
    var self = this;
    log.debug("Pausing playback on " + this.name);
    return deferredAction(
        this.client,
        "AVTransport",
        "Pause",
        {},
        function (result) {
            log.debug("Playback on " + self.name + " has been paused");
            return true;
        }
    );
}

RaumfeldDevice.prototype.play = function () {
    var self = this;
    log.debug("Starting playback on " + this.name);
    return deferredAction(
        this.client,
        "AVTransport",
        "Play",
        {},
        function () {
            log.debug("Playback on " + self.name + " has been started");
            return true;
        }
    );
}

RaumfeldDevice.prototype.stop = function () {
    var self = this;
    log.debug("Stopping playback on " + this.name);
    return deferredAction(
        this.client,
        "AVTransport",
        "Stop",
        {},
        function () {
            log.debug("Playback on " + self.name + " has been stopped");
            return true;
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

function deferredAction(client, serviceId, actionName, params, callback) {
    var deferred = Q.defer();
    var foo = client.callAction(serviceId, actionName, params, function (err, result) {
        if (err) deferred.reject(err);

        var res = callback(result);
        deferred.resolve(res);
    });

    return deferred.promise;
}

module.exports = RaumfeldDevice;
