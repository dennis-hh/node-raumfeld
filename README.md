# node-raumfeld
===============
This is a node module for Raumfeld. It maps upnp commands to usage-friendly method calls.

Installation
------------

Install for node.js `npm`:

``` bash
$ npm install node-raumfeld
```

Example
-------
``` javascript
var RaumfeldManager = require('node-raumfeld');

var manager = new RaumfeldManager();

// starts discovering devices asynchronously
manager.discover();

// fetch a device and do something with it. Method calls on a device return a promise object
var device = manager.getDevice("Kitchen");

device.getVolume().then(function(value) {
    console.log("Device volume is " + value);
});

```