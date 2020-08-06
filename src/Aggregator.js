const uuid = require('uuid')
const Emitter = require('eventemitter2').EventEmitter2
const stream = require('stream')
const utils = require('util')
function Aggregator (id) {
  this._id = id
  this._eventVersion = 0
  this._version = 0
  this._transientEvents = []
  this._emitter = new Emitter()
  stream.Writable.call(this, { objectMode: true })
  this.apply = function (eventName, domainEvent) {
    this._eventVersion += 1
    enhanceEvent(eventName, domainEvent, this)
    this._transientEvents.push(domainEvent)

    this._emitter.emit(eventName, domainEvent)
  }
}
utils.inherits(Aggregator, stream.Writable)
Aggregator.prototype.getId = function () {
  return this._id
}
Aggregator.prototype.getTransientEvent = function () {
  return this._transientEvents
}
Aggregator.prototype.getVersion = function () {
  return this._version
}
Aggregator.prototype.toEvent = function (eventName, eventHandler) {
  this._emitter.on(eventName, eventHandler)
}
Aggregator.prototype._write = function (domainEvent, encoded, next) {
  this._emitter.emit(domainEvent.eventName, domainEvent)
  this._eventVersion += 1
  this._version += 1
  next()
}

function enhanceEvent (eventName, domainEvent, aggregator) {
  domainEvent.eventName = eventName
  domainEvent.eventId = uuid.v1()
  domainEvent.aggregateId = aggregator._id
  domainEvent.eventVersion = aggregator._eventVersion
  domainEvent.eventTime = Date.now()
}

module.exports = Aggregator
