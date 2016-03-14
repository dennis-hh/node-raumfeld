var Q = require('q');
var log = require('loglevel');

function RaumfeldDevice(client) {
    this.client = client;
    this.name = client.deviceDescription.friendlyName;
}

RaumfeldDevice.prototype.getVolume = function() {
    var self = this;
    log.debug("Getting volume of " + this.name);
    return deferredAction(
        this.client,
        "RenderingControl",
        "GetVolume",
        {Channel: "Master"},
        function(result) {
            log.debug("Volume of " + self.name + " is " + result.CurrentVolume);
            return result.CurrentVolume;
        }
    );
}

RaumfeldDevice.prototype.setVolume = function(volume) {
    var self = this;
    log.debug("Setting volume of " + this.name + " to " + volume);
    return deferredAction(
        this.client,
        "RenderingControl",
        "SetVolume",
        {Channel: "Master", "DesiredVolume": volume},
        function(result) {
            log.debug("Volume of " + self.name + " has been set to " + volume);
        }
    );
}

RaumfeldDevice.prototype.pause = function() {
    var self = this;
    log.debug("Pausing playback on " + this.name);
    return deferredAction(
        this.client,
        "RenderingControl",
        "Pause",
        {},
        function(result) {
            log.debug("Playback on " + self.name + " has been paused");
        }
    );
}

function deferredAction(client, serviceId, actionName, params, callback){
    var deferred = Q.defer();
    var foo = client.callAction(serviceId, actionName, params, function(err, result) {
        if(err) deferred.reject(err);

        var res = callback(result);
        deferred.resolve(res);
    });

    return deferred.promise;
}

module.exports = RaumfeldDevice;
