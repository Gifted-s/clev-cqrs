const { edomain, Entity } = require('./entity')
const uuid = require('uuid')

let commandHandlers = (function () {
  const _this = {}
  const handlers = {}

  _this.handlers = (function () {
    return handlers
  })()

  _this.setHandlers = function (handler) {
    handlers[handler] = function (id, command, callback) {
      if (typeof id !== 'string') {
        throw new TypeError(`id must be string at  ${handler}`)
      }
      if (!id) {
        throw new Error(`${handler} must have an id as the first parameter`)
      }
      if (typeof callback !== 'function') {
        throw new TypeError(`handler must have a callback function, try adding a callback function as the third parameter to the ${handler} command handler `)
      }
      if (typeof command !== 'object') {
        throw new TypeError(`command expected to be an object but saw a ${typeof command} at ${handler} command `)
      }
      if (id) {
        edomain.get(id, function (entity) {
          if (!entity[handler]) {
            throw new Error('handler for this command does notexist')
          }
          entity[handler](command)

          edomain.save(entity, function (eventJustEmitted) {
            callback(eventJustEmitted)
          })
        })
      }
    }

    if (handler === 'handleCreate') {
      handlers['handleCreate'] = function (command, callback) {
        if (typeof callback !== 'function') {
          throw new TypeError(`handler must have a callback function, try adding a callback function as the second parameter to the handleCreate command handler `)
        }
        if (typeof command !== 'object') {
          throw new TypeError(`command expected to be an object but saw a ${typeof command} at handleCreate command `)
        }
        // makeCommand.schema.id= uuid.v1()
        let entity = new Entity(uuid.v1())
        entity.handleCreate(command)
        edomain.save(entity, function (eventJustEmitted) {
          callback(eventJustEmitted)
        })
      }
    }
  }
  return _this
})()

module.exports = commandHandlers
