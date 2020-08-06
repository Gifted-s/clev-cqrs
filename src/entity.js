
const Aggregator = require('./Aggregator')
const utils = require('util')
const eventStore = require('./eventStore')
const compareType = require('./types')
const messageBus = require('./messageBus')
function Entity (id) {
  // get properties
  const makeCommand = require('../index')
  let schema = makeCommand.schema
  let properties = Object.keys(schema.fields)
  for (let property of properties) {
    this[property] = null
    delete this['id']
  }
  let handlers = Object.keys(schema.commandHandlers)
  for (let handler of handlers) {
    this[handler] = function (command) {
      if (handler === 'handleCreate') {
        for (let i of Object.keys(schema.fields).values()) {
          if (schema.fields[i].required && !command[i]) {
            throw new Error(`${schema.schemaName} must have a ${i} field`)
          }
        }
      }
      for (let i of Object.keys(command).values()) {
        compareType(schema.fields[i].type, command[i], function (err, correcttype) {
          if (err) {
            throw new TypeError(`${i} must be of type ${correcttype}`)
          }
        })
        if (schema.fields[i].max || schema.fields[i].min) {
          if (command[i] > schema.fields[i].max || command[i] < schema.fields[i].min) {
            throw TypeError(`${i} not in range ${i} must not be less than ${schema.fields[i].min ? schema.fields[i].min : 0} and must not be greater than ${schema.fields[i].max ? schema.fields[i].max : 'unspecified'}`)
          }
        }
      }
      this.apply(handler.slice(6, handler.length + 1), command)
    }
  }

  Aggregator.call(this, id)

  subscribeToEvent(schema, this)
}
utils.inherits(Entity, Aggregator)

function subscribeToEvent (schema, entity) {
  let handlers = Object.keys(schema.commandHandlers)
  for (let handler of handlers) {
    entity.toEvent(handler.slice(6, handler.length + 1), function (obj) {
      schema.commandHandlers[handler](obj, entity)
    })
  }
}

function EntityDomain () { }
EntityDomain.prototype.save = function (entity, callback) {
  let transientEvents = entity.getTransientEvent()
  eventStore.save(transientEvents, entity.getVersion(), entity.getId(), function (err, eventJustEmitted) {
    if (err) {
      throw new Error(err)
    } else {
      return callback(eventJustEmitted)
    }
  })
  transientEvents.forEach(domainEvent => {
    messageBus.publish({ ...domainEvent, id: entity.getId() })
  })
}
EntityDomain.prototype.get = function (id, callback) {
  let entity = new Entity(id)

  eventStore.get(id, function (err, eventStream) {
    if (err) {
      throw new Error('item not found')
    } else {
      eventStream.pipe(entity)
        .on('error', (err) => {
          throw err
        })
        .on('finish', () => {
          eventStream.unpipe()

          return callback(entity)
        })
    }
  })
}
exports.edomain = new EntityDomain()

exports.Entity = Entity
