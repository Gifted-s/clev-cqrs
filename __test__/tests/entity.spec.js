/* eslint-disable new-cap */
let buildSchema = require('../fixtures/makeSchema')
let schema = buildSchema({
  schemaName: 'User', // name of entity
  fields: {

    name: {
      type: 'string',
      required: true
    },
    age: {
      max: 100,
      min: 1,
      type: 'number'
    },
    nameToBuffer: {
      type: 'buffer'
    },
    dob: {
      type: 'date',
      required: false
    },
    mixed: {
      type: 'mix'
    },
    address: {
      type: 'object'
    },
    roles: {
      type: 'array'
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
describe('Entity', () => {
  it('must throw error since name is required and it was not entered', () => {
    expect(() => newUser.handleCreate({

      address: {
        town: 'ado'
      },
      roles: [1, 2],
      mixed: '1234',
      dob: 123,
      nameToBuffer: new Buffer.alloc(1, 2),
      age: 5

    })).toThrow('User must have a name field')
  })
  it('should not throw error since dob is not required and it was not entered', () => {
    expect(() => newUser.handleCreate({
      name: 'Adewumi Sunkanmi',
      address: {
        town: 'ado'
      },
      roles: [1, 2],
      mixed: '1234',
      nameToBuffer: new Buffer.alloc(1, 2),
      age: 5

    })).toBeDefined()
  })
  it('should throw error since age has a maximum of 100 and 120 was entered', () => {
    expect(() => newUser.handleChangeAge({
      age: 120
    })).toThrow(`age not in range age must not be less than 1 and must not be greater than 100`)
  })
  it('should throw error since age has a minimum of 1 and -1 was entered', () => {
    expect(() => newUser.handleChangeAge({
      age: -1
    })).toThrow(`age not in range age must not be less than 1 and must not be greater than 100`)
  })
})
