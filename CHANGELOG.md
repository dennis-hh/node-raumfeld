# Changelog

## 0.4.4
- added updateInterval parameter to discover method

## 0.4.3
- added error handling for when device returns undefined state

## 0.4.2
- added possibility to instantiate devices by url (asynchronously)

## 0.4.1
- small adjustment to device instantiation

## 0.4.0
- moved getState to VirtualRenderer, as real ones do not support this feature
- switched "includeVirtual" to ternary flag; possible values are "virtual, real, all"

## 0.3.0 (2016-03-30)
- removed local storage of renderers and media server
- added EventEmitter dependency; found devices are now emitted
- changed "onlyVirtual" flag to "includeVirtual"

## 0.2.0 (2016-03-22)
- added virtual renderer to be able to handle room/zone capabilities
- added getMediaInfo to virtual renderer
- updated upnp client dependency
- renamed device to renderer
- added hasRenderer method
- added media server (WIP)
- added state request (only implemented for virtual renderers)
- added possibility to only add virtual renderers

## 0.1.0 (2016-03-14)
- added functionality for mute control, play, pause and stop

## 0.0.1 (2016-03-13)
- initial release with minimal functionality
