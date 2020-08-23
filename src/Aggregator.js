'use strict'
const uuid = require('uuid')
const Emitter = require('eventemitter2').EventEmitter2
const stream = require('stream')
const utils = require('util')
function Aggregator (id) {
  // setting properties
  this._id = id
  this._eventVersion = 0
  this._version = 0
  this._transientEvents = []
  this._emitter = new Emitter()
  stream.Writable.call(this, { objectMode: true })
  // setting event handlers
  this.apply = function (eventName, domainEvent) {
    this._eventVersion += 1
    enhanceEvent(eventName, domainEvent, this)
    this._transientEvents.push(domainEvent)
    this._emitter.emit(eventName, domainEvent)
  }
}
// Aggregator contructor inherits the Writable sream contructor
utils.inherits(Aggregator, stream.Writable)
// return aggregate id
Aggregator.prototype.getId = function () {
  return this._id
}
// returns events that just happened
Aggregator.prototype.getTransientEvent = function () {
  return this._transientEvents
}
// returns the previous version of the event
Aggregator.prototype.getVersion = function () {
  return this._version
}
// set functions to execute when a particular event is emitted
/**
 * @param {string} eventName
 * @param {function} eventHandler
 */
Aggregator.prototype.toEvent = function (eventName, eventHandler) {
  this._emitter.on(eventName, eventHandler)
}
// write events to the Writable stream
/**
 * @param {object} domainEvent
 * @param {function} encoded
 * @param {function} next
 */
Aggregator.prototype._write = function (domainEvent, encoded, next) {
  this._emitter.emit(domainEvent.eventName, domainEvent)
  this._eventVersion += 1
  this._version += 1
  // go to the next process
  next()
}
// Add more fields to event
function enhanceEvent (eventName, domainEvent, aggregator) {
  domainEvent.eventName = eventName
  domainEvent.eventId = uuid.v1()
  domainEvent.aggregateId = aggregator._id
  domainEvent.eventVersion = aggregator._eventVersion
  domainEvent.eventTime = new Date(Date.now()).toUTCString()
}
// returns Aggregator contructor
module.exports = Aggregator
