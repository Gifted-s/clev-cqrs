let messageBus = (function () {
  let _this = {}
  let eventHandlers = []
  _this.registerHandler = function (handlers) {
    handlers.forEach(handler => {
      eventHandlers.push(handler)
    })
  }
  _this.publish = function (event) {
    eventHandlers.forEach(eventHandler => {
      eventHandler.write(event)
    })
  }
  return _this
})()
module.exports = messageBus
