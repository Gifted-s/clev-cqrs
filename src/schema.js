
const eventStore = require('./eventStore')

const commandHandlers = require('./commandHandlers')
const messageBus = require('./messageBus')

function Schema (schemaFields) {
  if (!schemaFields.schemaName) {
    throw new Error('Error, schema must have a name')
  }
  if (typeof schemaFields.schemaName !== 'string') {
    throw new Error(`schemaName must be a string but saw a ${typeof schemaFields.schemaName}`)
  }
  if (!schemaFields.fields) {
    throw new Error('Error, schema must have fields')
  }
  if (typeof schemaFields.fields !== 'object') {
    throw new Error(`schema fields must be an object but saw a ${typeof schemaFields.fields}`)
  }
  for (let i of Object.keys(schemaFields.fields).values()) {
    if (typeof schemaFields.fields[i] !== 'object') {
      throw new Error(`schemaFields.fields.${i} must be an object but saw a ${typeof schemaFields.fields[i]}`)
    }
    if (!schemaFields.fields[i].type) {
      throw new Error(`schemaFields.fields.${i} must have a [type] property`)
    }
  }
  if (!schemaFields.commandHandlers) {
    throw new Error('Error, schema must have commandHandlers property')
  }
  if (typeof schemaFields.commandHandlers !== 'object') {
    throw new Error(`schema command handlers must be an object but saw a ${typeof schemaFields.commandHandlers}`)
  }
  for (let i of Object.keys(schemaFields.commandHandlers).values()) {
    if (typeof schemaFields.commandHandlers[i] !== 'function') {
      throw new Error(`${i} must be a function but saw a ${typeof schemaFields.commandHandlers[i]}`)
    }
  }
  if (!schemaFields.eventStore) {
    throw new Error(`schema must have an [eventStore] property `)
  }

  if (typeof schemaFields.eventStore !== 'object') {
    throw new Error(`schema eventStore must be an object but saw a ${typeof schemaFields.eventStore}`)
  }

  if (typeof schemaFields.eventStore.methods !== 'object') {
    throw new Error(`schema eventStore.methods must be an object but saw a ${typeof schemaFields.eventStore.methods}`)
  }

  for (let i of Object.keys(schemaFields.eventStore.methods).values()) {
    if (typeof schemaFields.eventStore.methods[i] !== 'function') {
      throw new Error(`eventStore.methods.${i} must be a function but saw a ${typeof schemaFields.eventStore.methods[i]}`)
    }
  }
  if ('get' in schemaFields.eventStore.methods === false ||
  'getAll' in schemaFields.eventStore.methods === false ||
  'delete' in schemaFields.eventStore.methods === false ||
  'save' in schemaFields.eventStore.methods === false
  ) {
    throw new Error('eventStore.methods must have the following property get, delete, getAll and save')
  }
  if (typeof schemaFields.eventHandlers !== 'object') {
    throw new Error(`schema eventHandlers must be an object but saw a ${typeof schemaFields.eventHandlers}`)
  }
  if (!Array.isArray(schemaFields.eventHandlers.views)) {
    throw new Error(`schema eventHandlers.views must be an array but saw a ${typeof schemaFields.eventHandlers.views}`)
  }

  for (let i of schemaFields.eventHandlers.views.values()) {
    if (typeof i !== 'object') {
      throw new Error(`View must be an object but saw a ${typeof i}`)
    }
  }

  this.id = null
  this.schemaName = schemaFields.schemaName
  this.fields = schemaFields.fields
  this.commandHandlers = schemaFields.commandHandlers
  this.eventStore = schemaFields.eventStore
  this.eventHandlers = schemaFields.eventHandlers
  let handlers = Object.keys(schemaFields.commandHandlers)
  for (let handler of handlers) {
    if (handler.search('handle') < 0) {
      throw new Error(`handler's name must start with [handle] but you used ${handler} please use the format handleHandlerName`)
    }
    if (typeof schemaFields.commandHandlers[handler] !== 'function') {
      throw new TypeError(`handler must be a function -> ${handler},  expected handler to be a  function but saw an ${typeof schemaFields.commandHandlers[handler]}`)
    }
    commandHandlers.setHandlers(handler)
  }
  eventStore.setStore({
    get: this.eventStore.methods.get,
    save: this.eventStore.methods.save,
    getAll: this.eventStore.methods.getAll,
    delete: this.eventStore.methods.delete
  })
  messageBus.registerHandler(schemaFields.eventHandlers.views)
}
module.exports = Schema
