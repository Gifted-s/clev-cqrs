const stream = require('stream')
const util = require('util')

function ViewAggregator () {
  stream.Writable.call(this, { objectMode: true })
  this.setHandlers = function (handlers) {
    for (let i of Object.keys(handlers).values()) {
      if (i.search('handle') < 0) {
        throw new Error(` handler's name must start with [handle] but you used ${i} please use the format handleHandlerName `)
      }
      if (typeof handlers[i] !== 'function') {
        throw new TypeError(` handler must be a function -> ${i},  expected handler to be a  function but saw an ${typeof handlers[i]}`)
      }
      this[i] = handlers[i]
    }
  }
}
util.inherits(ViewAggregator, stream.Writable)
ViewAggregator.prototype._write = function (domainEvent, encoding, next) {
  let eventHandlerName = 'handle' + domainEvent.eventName
  let eventHandler = this[eventHandlerName] || dummyEventHandler

  eventHandler(domainEvent, function (err) {
    if (err) {
      throw err
    }
    next()
  })
}
function dummyEventHandler (domainEvent, callback) {
  process.nextTick(callback)
}
exports.View = ViewAggregator
