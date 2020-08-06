/* eslint-disable new-cap */
let buildSchema = require('../fixtures/makeSchema')
let schema = buildSchema({
  schemaName: 'User', // name of entity
  fields: {
    name: {
      type: 'string',
      required: false
    },
    nameToBuffer: {
      type: 'buffer'
    },
    dob: {
      type: 'date'
    },
    mixed: {
      type: 'mix'
    },
    address: {
      type: 'object'
    },
    roles: {
      type: 'array'
    },
    age: {
      max: 100,
      min: 0,
      type: 'number'
    }
  },
  commandHandlers: {
    handleCreate: function (p, entity) {
      entity.roles = p.roles
      entity.mixed = p.mixed
      entity.nameToBuffer = p.nameToBuffer
      entity.address = p.address
      entity.dob = p.dob
      entity.name = p.name
      entity.age = p.age

      return entity
    },
    handleChangeName: function (p, entity) {
      entity.name = p.name
      return entity
    },

    handleChangeAge: function (p, entity) {
      entity.age = p.age
      return entity
    },
    handleChangeRoles: function (p, entity) {
      entity.roles = p.roles
      return entity
    },
    handleChangeAddress: function (p, entity) {
      entity.address = p.address
      return entity
    },
    handleChangeMixed: function (p, entity) {
      entity.mixed = p.mixed
      return entity
    },
    handleChangeNameToBuffer: function (p, entity) {
      entity.nameToBuffer = p.nameToBuffer
      return entity
    },
    handleChangeDOB: function (p, entity) {
      entity.dob = p.dob
      return entity
    }

  }
})
const makeCommand = require('../..')
makeCommand.setSchema(schema)
// const commandHandlers = require('../../src/commandHandlers')
const { Entity } = require('../../src/entity')
const newUser = new Entity('djdfhjkdf-dfhdjkf-djdk')
describe('TypeCheck', () => {
  it('must throw error since name is type string and type number was entered', () => {
    expect(() => newUser.handleCreate({
      name: 1,
      address: {
        town: 'ado'
      },
      roles: [1, 2],
      mixed: '1234',
      dob: 123,
      nameToBuffer: new Buffer.alloc(1, 2),
      age: 5

    })).toThrow('name must be of type string')
  })
  it('must throw error since address is type object and type string was entered', () => {
    expect(() => newUser.handleChangeAddress({
      address: 'address should be an object'
    })).toThrow('address must be of type object')
  })
  it('must throw error since roles is type array and type string was entered', () => {
    expect(() => newUser.handleChangeRoles({
      roles: 'test'
    })).toThrow('roles must be of type array')
  })
  it('must  not throw error for mixed type', () => {
    expect(() => newUser.handleChangeMixed({
      mixed: '1234'
    })).toBeDefined()
  })
  it('must throw error since dob is of  type date but an object was enterd', () => {
    expect(() => newUser.handleChangeDOB({
      dob: {
        day: 'this should be of type date'
      }
    })).toThrow('dob must be of type date')
  })
  it('must throw error since nameToBuffer is of  type buffer but a number was enterd', () => {
    expect(() => newUser.handleChangeNameToBuffer({
      nameToBuffer: 1
    })).toThrow('nameToBuffer must be of type buffer')
  })
  it('must throw error since age is of  type number but a string was enterd', () => {
    expect(() => newUser.handleChangeAge({
      age: 'this should be a number'
    })).toThrow('age must be of type number')
  })
})
