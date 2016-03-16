var RaumfeldManager = require('node-raumfeld');

var manager = new RaumfeldManager();

// starts discovering renderers asynchronously
manager.discover();

// fetch a renderer and do something with it. Method calls on a renderer return a promise object
var renderer = manager.getRenderer("Kitchen");

renderer.getVolume().then(function(value) {
    console.log("Renderer volume is " + value);
});