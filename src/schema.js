'use strict'
// get the event store module and set it to the eventStore variable
const eventStore = require('./eventStore')
// get the commadhandlers module and set it to the commandHandlers
const commandHandlers = require('./commandHandlers')
// get the messagebus module and assign it to the messageBus variable
const messageBus = require('./messageBus')
/**
 * The schema contructor
 * @param {Object} schemaFields
 */
function Schema (schemaFields) {
  // checking if schemaName was set
  if (!schemaFields.schemaName) {
    throw new Error('Error, schema must have a name')
  }
  // checking if type of schema name ia a string
  if (typeof schemaFields.schemaName !== 'string') {
    throw new Error(`schemaName must be a string but saw a ${typeof schemaFields.schemaName}`)
  }
  // checking if the fields was set
  if (!schemaFields.fields) {
    throw new Error('Error, schema must have fields')
  }
  // checking if fields was an object
  if (typeof schemaFields.fields !== 'object') {
    throw new Error(`schema fields must be an object but saw a ${typeof schemaFields.fields}`)
  }
  // checking for each fields that was enterd
  for (let i of Object.keys(schemaFields.fields).values()) {
    // checking if each field data type is an object
    if (typeof schemaFields.fields[i] !== 'object') {
      throw new Error(`schemaFields.fields.${i} must be an object but saw a ${typeof schemaFields.fields[i]}`)
    }
    // checking if the field type was specified
    if (!schemaFields.fields[i].type) {
      throw new Error(`schemaFields.fields.${i} must have a [type] property`)
    }
  }
  // checking if the commandHandlers were set
  if (!schemaFields.commandHandlers) {
    throw new Error('Error, schema must have commandHandlers property')
  }
  // checking if commandHandlers is an object
  if (typeof schemaFields.commandHandlers !== 'object') {
    throw new Error(`schema command handlers must be an object but saw a ${typeof schemaFields.commandHandlers}`)
  }
  // checking if each field in the  commandHandler object was set to a function
  for (let i of Object.keys(schemaFields.commandHandlers).values()) {
    if (typeof schemaFields.commandHandlers[i] !== 'function') {
      throw new Error(`${i} must be a function but saw a ${typeof schemaFields.commandHandlers[i]}`)
    }
  }
  // checking if the eventStore was set
  if (!schemaFields.eventStore) {
    throw new Error(`schema must have an [eventStore] property `)
  }
  // checking if type of eventStore is an object
  if (typeof schemaFields.eventStore !== 'object') {
    throw new Error(`schema eventStore must be an object but saw a ${typeof schemaFields.eventStore}`)
  }
  // checking if the methods key is an object
  if (typeof schemaFields.eventStore.methods !== 'object') {
    throw new Error(`schema eventStore.methods must be an object but saw a ${typeof schemaFields.eventStore.methods}`)
  }
  // cheking if the each field in the method object was set to a function
  for (let i of Object.keys(schemaFields.eventStore.methods).values()) {
    if (typeof schemaFields.eventStore.methods[i] !== 'function') {
      throw new Error(`eventStore.methods.${i} must be a function but saw a ${typeof schemaFields.eventStore.methods[i]}`)
    }
  }
  // checking that the eventStore.methods has the following keys [get, getAll, delete, save]
  if ('get' in schemaFields.eventStore.methods === false ||
  'getAll' in schemaFields.eventStore.methods === false ||
  'delete' in schemaFields.eventStore.methods === false ||
  'save' in schemaFields.eventStore.methods === false
  ) {
    throw new Error('eventStore.methods must have the following property get, delete, getAll and save')
  }
  // checking if the eventHandlers is an object
  if (typeof schemaFields.eventHandlers !== 'object') {
    throw new Error(`schema eventHandlers must be an object but saw a ${typeof schemaFields.eventHandlers}`)
  }
  // checking if type of the eventHandlers.views key was set to an array
  if (!Array.isArray(schemaFields.eventHandlers.views)) {
    throw new Error(`schema eventHandlers.views must be an array but saw a ${typeof schemaFields.eventHandlers.views}`)
  }
  // checking if element in the eventHandlers.views array is an object
  for (let i of schemaFields.eventHandlers.views.values()) {
    if (typeof i !== 'object') {
      throw new Error(`View must be an object but saw a ${typeof i}`)
    }
  }
  // setting the properties of the Schema instance just created
  this.id = null
  this.schemaName = schemaFields.schemaName
  this.fields = schemaFields.fields
  this.commandHandlers = schemaFields.commandHandlers
  this.eventStore = schemaFields.eventStore
  this.eventHandlers = schemaFields.eventHandlers
  let handlers = Object.keys(schemaFields.commandHandlers)
  for (let handler of handlers) {
    // checking the naming convention of the commandHandlers which must start with the [handle] world
    if (handler.search('handle') < 0) {
      throw new Error(`handler's name must start with [handle] but you used ${handler} please use the format handleHandlerName`)
    }
    // checking if each commandHandler type is a function
    if (typeof schemaFields.commandHandlers[handler] !== 'function') {
      throw new TypeError(`handler must be a function -> ${handler},  expected handler to be a  function but saw an ${typeof schemaFields.commandHandlers[handler]}`)
    }
    // calling the setHandlers function from the commandHandlers module to take in the handlers from the new Schema instance just created
    commandHandlers.setHandlers(handler)
  }
  // calling the setStore function from the eventStore module to take in the eventStore field from the new Schema instance just created
  eventStore.setStore({
    get: this.eventStore.methods.get,
    save: this.eventStore.methods.save,
    getAll: this.eventStore.methods.getAll,
    delete: this.eventStore.methods.delete
  })
  // calling the registerHandler function from the messageBus module to register eventHandlers from the new Schema instance just created
  messageBus.registerHandler(schemaFields.eventHandlers.views)
}
// export Schema contructor
module.exports = Schema
