var RaumfeldManager = require('./index.js');
var log = require('loglevel');
log.setLevel("debug");
var manager = new RaumfeldManager();


manager.discover();

setTimeout(function() {


    var device = manager.getDevice("Speaker Schlafzimmer");
    device.play().then(function() {

    });

}, 3000);
