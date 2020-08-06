let buildMakeSchema = require('../fixtures/makeSchema')

describe('Schema Contructor', () => {
  it('it must have a schema name', () => {
    expect(() => buildMakeSchema({
      schemaName: undefined
    })).toThrow('Error, schema must have a name')
  })
  it('it must have a schema name which is a string', () => {
    expect(() => buildMakeSchema({
      schemaName: 1
    })).toThrow(`schemaName must be a string but saw a number`)
  })
  it('it must have a fields property', () => {
    expect(() => buildMakeSchema({
      fields: undefined
    })).toThrow(`Error, schema must have fields`)
  })
  it('it must have a field which must be an object', () => {
    expect(() => buildMakeSchema({
      fields: 'it should not be a string'
    })).toThrow(`schema fields must be an object but saw a string`)
  })
  it('it must have a fields property which each key must point to an object', () => {
    expect(() => buildMakeSchema({
      fields: {
        name: 1
      }
    })).toThrow(`schemaFields.fields.name must be an object but saw a number`)
  })

  it('it must have a fields property which each key must point to an object that has a type property', () => {
    expect(() => buildMakeSchema({
      fields: {
        name: {
          required: true
        }
      }
    })).toThrow(`schemaFields.fields.name must have a [type] property`)
  })
  it('it must have commandHandlers', () => {
    expect(() => buildMakeSchema({
      commandHandlers: undefined
    })).toThrow(`Error, schema must have commandHandlers property`)
  })
  it('it must have commandHandlers which must be an object', () => {
    expect(() => buildMakeSchema({
      commandHandlers: 'this should be an object'
    })).toThrow(`schema command handlers must be an object but saw a string`)
  })
  it('it must have commandHandlers which must be an object and each key must point to a function', () => {
    expect(() => buildMakeSchema({
      commandHandlers: {
        handleChangeName: 1234
      }
    })).toThrow(`handleChangeName must be a function but saw a number`)
  })
  it('it must have an eventStore property', () => {
    expect(() => buildMakeSchema({
      eventStore: undefined
    })).toThrow(`schema must have an [eventStore] property `)
  })
  it('it must have an eventStore property which is an object', () => {
    expect(() => buildMakeSchema({
      eventStore: 'not a string'
    })).toThrow(`schema eventStore must be an object but saw a string`)
  })
  it('it must have an eventStore property which is an object with a key called method', () => {
    expect(() => buildMakeSchema({
      eventStore: {
        methods: undefined
      }
    })).toThrow(`schema eventStore.methods must be an object but saw a undefined`)
  })
  it('it must have an eventStore property which is an object with a key of methods and each key in methods must point to a function', () => {
    expect(() => buildMakeSchema({
      eventStore: {
        methods: {
          get: 'this should be a function'
        }
      }
    })).toThrow(`eventStore.methods.get must be a function but saw a string`)
  })
  it('it must have an eventHandlers property', () => {
    expect(() => buildMakeSchema({
      eventHandlers: undefined
    })).toThrow(`schema eventHandlers must be an object but saw a undefined`)
  })
  it('it must have an eventHandlers property which is an object', () => {
    expect(() => buildMakeSchema({
      eventHandlers: 1234
    })).toThrow(`schema eventHandlers must be an object but saw a number`)
  })
  it('it must have an eventHandlers property which is an object with a views property', () => {
    expect(() => buildMakeSchema({
      eventHandlers: {
        views: undefined
      }
    })).toThrow(`schema eventHandlers.views must be an array but saw a undefined`)
  })
  it('it must have an eventHandlers property which is an object with a views property and views of type array', () => {
    expect(() => buildMakeSchema({
      eventHandlers: {
        views: 'its an array'
      }
    })).toThrow(`schema eventHandlers.views must be an array but saw a string`)
  })
  it('it must have an eventHandlers property which is an object with a views property and views of type array that contains object/s', () => {
    expect(() => buildMakeSchema({
      eventHandlers: {
        views: ['its an array']
      }
    })).toThrow(`View must be an object but saw a string`)
  })
  it('it must have an eventStorage which is an object with methods property and the get, delete, getAll and save key must be in methods object', () => {
    expect(() => buildMakeSchema({
      eventStore: {
        methods: {
          get: function () {},
          delete: function () {},
          getAll: function () {}

        }
      }
    })).toThrow(`eventStore.methods must have the following property get, delete, getAll and save`)
  })
  it('it must have commandHandlers which must be an object and each key must start with [handle]', () => {
    expect(() => buildMakeSchema({
      commandHandlers: {
        ChangeName: function () {}
      }
    })).toThrow(`handler's name must start with [handle] but you used ChangeName please use the format handleHandlerName`)
  })
})
