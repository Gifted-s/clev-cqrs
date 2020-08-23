'use strict'
const stream = require('stream')
const util = require('util')

function ViewAggregator () {
  stream.Writable.call(this, { objectMode: true })
  /**
   * @param {object} handlers
   */
  this.setHandlers = function (handlers) {
    for (let i of Object.keys(handlers).values()) {
      // checking the name, name must start with the [handle] name
      if (i.search('handle') < 0) {
        throw new Error(` handler's name must start with [handle] but you used ${i} please use the format handleHandlerName `)
      }
      // checking the handler which must be a function
      if (typeof handlers[i] !== 'function') {
        throw new TypeError(` handler must be a function -> ${i},  expected handler to be a  function but saw an ${typeof handlers[i]}`)
      }
      // setting the handlers
      this[i] = handlers[i]
    }
  }
}
util.inherits(ViewAggregator, stream.Writable)
/**
 * @param {object} domainEvent
 * @param {function} encoding
 * @param {function} next
 */
// write events to the handlers
ViewAggregator.prototype._write = function (domainEvent, encoding, next) {
  // creating the eventHandler name
  let eventHandlerName = 'handle' + domainEvent.eventName
  // getting the event handler
  let eventHandler = this[eventHandlerName] || dummyEventHandler
  // handle event
  eventHandler(domainEvent, function (err) {
    // checking if there was an error while handling event
    if (err) {
      throw err
    }
    // go to the next process
    next()
  })
}
/**
 * @param {object} domainEvent
 * @param {function} callback
 */
// this function would be called in case there is no handler for the event
function dummyEventHandler (domainEvent, callback) {
  // calling the next process
  process.nextTick(callback)
}
// export ViewAggregator
exports.View = ViewAggregator
