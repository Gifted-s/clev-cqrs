'use strict'
const { edomain, Entity } = require('./entity')
const uuid = require('uuid')

let commandHandlers = (function () {
  const _this = {}
  const handlers = {}
  // the _this.handlers would be executed to return a function that that when called returns all the command handlers
  _this.handlers = (function () {
    return handlers
  })()
  /**
  * @param {string} handler
  */
  _this.setHandlers = function (handler) {
    // setting handlers name to the function it performs
    handlers[handler] = function (id, command, callback) {
      // checking if the id entered was a string
      if (typeof id !== 'string') {
        throw new TypeError(`id must be string at  ${handler}`)
      }
      // checking if id parameter was entered
      if (!id) {
        throw new Error(`${handler} must have an id as the first parameter`)
      }
      // checking if the callback enterd was a function type
      if (typeof callback !== 'function') {
        throw new TypeError(`handler must have a callback function, try adding a callback function as the third parameter to the ${handler} command handler `)
      }
      // checking if the command parameter was an object
      if (typeof command !== 'object') {
        throw new TypeError(`command expected to be an object but saw a ${typeof command} at ${handler} command `)
      }
      if (id) {
        // getting previous events
        edomain.get(id, function (entity) {
          // checking if the handler for the command exist in the entity object
          if (!entity[handler]) {
            throw new Error('handler for this command does not exist')
          }
          // command is handled in the entity object
          entity[handler](command)
          // events are saved back to database
          edomain.save(entity, function (eventJustEmitted) {
            // execute callback
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
  // return the _this object
  return _this
})()
// export the commandHandler function
module.exports = commandHandlers
