let messageBus = (function () {
  let _this = {}
  let eventHandlers = []
  /**
   * @param {object} handlers
   */
  // register all handlers from the schema
  _this.registerHandler = function (handlers) {
    handlers.forEach(handler => {
      eventHandlers.push(handler)
    })
  }
  // publish events to the eventHandlers to be handled
  /**
   * @param {object} event
   */
  _this.publish = function (event) {
    eventHandlers.forEach(eventHandler => {
      // write to event handlers
      eventHandler.write(event)
    })
  }
  // return _this object
  return _this
})()
// export messageBus
module.exports = messageBus
