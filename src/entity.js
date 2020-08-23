'use strict'
const Aggregator = require('./Aggregator')
const utils = require('util')
const eventStore = require('./eventStore')
const compareType = require('./types')
const messageBus = require('./messageBus')
// Entity contructor
function Entity (id) {
  const makeCommand = require('../index')
  // assigning  the makeCommand.schema  the schema variable
  let schema = makeCommand.schema
  // gettingall the fields from the schema variable
  let properties = Object.keys(schema.fields)
  for (let property of properties) {
    this[property] = null
    delete this['id']
  }
  // getti getting all the command handlers from the schema
  let handlers = Object.keys(schema.commandHandlers)
  for (let handler of handlers) {
    this[handler] = function (command) {
      // setting handler from the handleCreate command
      if (handler === 'handleCreate') {
        for (let i of Object.keys(schema.fields).values()) {
          // checking if a particular field is requried
          if (schema.fields[i].required && !command[i]) {
            throw new Error(`${schema.schemaName} must have a ${i} field`)
          }
        }
      }
      // setting handler for other command apart from the handleCreate command
      for (let i of Object.keys(command).values()) {
        // validating the ntype that was entered
        compareType(schema.fields[i].type, command[i], function (err, correcttype) {
          if (err) {
            throw new TypeError(`${i} must be of type ${correcttype}`)
          }
        })
        // checking and validating all the integers that was entered with the maximum and minimum number specified from the schema
        if (schema.fields[i].max || schema.fields[i].min) {
          if (command[i] > schema.fields[i].max || command[i] < schema.fields[i].min) {
            throw TypeError(`${i} not in range ${i} must not be less than ${schema.fields[i].min ? schema.fields[i].min : 0} and must not be greater than ${schema.fields[i].max ? schema.fields[i].max : 'unspecified'}`)
          }
        }
      }
      // applying the handler to the command that was passed
      this.apply(handler.slice(6, handler.length + 1), { ...command, data: { changedData: JSON.stringify(command) } })
    }
  }
  Aggregator.call(this, id)
  // subscribe to various events that can be emitted and call the functions that can handle it
  subscribeToEvent(schema, this)
}
// the Entity contructor inherits from the Aggregator  contructor
utils.inherits(Entity, Aggregator)
/**
 * @param {object} schema
 * @param {object} entity
 */
function subscribeToEvent (schema, entity) {
  // getting command handlers name as an array from  the command handlers in the schema
  let handlers = Object.keys(schema.commandHandlers)
  for (let handler of handlers) {
    // function to be executed when an event is emitted
    entity.toEvent(handler.slice(6, handler.length + 1), function (obj) {
      // calling command handler from the schema
      schema.commandHandlers[handler](obj, entity)
    })
  }
}
/**
 * EntityDomain contructor to save and get events from event store
 */
function EntityDomain () { }
/**
 * @param {object} entity
 * @param {function} callback
 */
EntityDomain.prototype.save = function (entity, callback) {
  // get the events that just happened and assigning it to transientEvents
  let transientEvents = entity.getTransientEvent()
  // save events to the event store
  eventStore.save(transientEvents, entity.getVersion(), entity.getId(), function (err, eventJustEmitted) {
    // checking for error
    if (err) {
      throw new Error(err)
    } else {
      // execute callback
      return callback(eventJustEmitted)
    }
  })
  transientEvents.forEach(domainEvent => {
    // publish each event to the message bus to make the eventhandler from the views to handle it
    messageBus.publish({ ...domainEvent, id: entity.getId() })
  })
}
/**
 * @param {string} id
 * @param {function} callback
 * Fetch pre existing events from the database
 */

EntityDomain.prototype.get = function (id, callback) {
  // create  Entity instance
  let entity = new Entity(id)
  // fetching events from event store
  eventStore.get(id, function (err, eventStream) {
    // checking for error while saving
    if (err) {
      throw new Error('item not found')
    } else {
      // pipe events from the eventstore to the new entity just created to replay to current state
      eventStream.pipe(entity)
        .on('error', (err) => {
          // checking for errors
          throw err
        })
        // checking if operation has finished
        .on('finish', () => {
          // unpipe event stream
          eventStream.unpipe()
          // call the callback function
          return callback(entity)
        })
    }
  })
}
// export entity domain
exports.edomain = new EntityDomain()
// export entity constructor
exports.Entity = Entity
