var RaumfeldManager = require('node-raumfeld');

var manager = new RaumfeldManager();

// starts discovering renderers asynchronously
manager.discover();

//listen for rendererFound event
manager.on("rendererFound", function(renderer) {
    renderer.getVolume().then(function(value) {
        console.log(renderer.name + " volume is " + value);
    });
});
