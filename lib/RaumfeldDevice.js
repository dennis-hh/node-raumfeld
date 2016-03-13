var request = require("request");
var Q = require('q');

function RaumfeldDevice(client) {
    this.client = client;
    this.name = client.deviceDescription.friendlyName;
}

RaumfeldDevice.prototype.getVolume = function() {
    var self = this;
    console.log("Getting volume of " + this.name);
    return deferredAction(
        this.client,
        "RenderingControl",
        "GetVolume",
        {Channel: "Master"},
        function(result) {
            console.log("Volume of " + self.name + " is " + result.CurrentVolume);
            return result.CurrentVolume;
        }
    );
}

RaumfeldDevice.prototype.setVolume = function(volume) {
    var self = this;
    console.log("Setting volume of " + this.name + " to " + volume);
    return deferredAction(
        this.client,
        "RenderingControl",
        "SetVolume",
        {Channel: "Master", "DesiredVolume": volume},
        function(result) {
            console.log("Volume of " + self.name + " has been set to " + volume);
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