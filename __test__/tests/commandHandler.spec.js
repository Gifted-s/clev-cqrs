let buildMakeSchema = require('../fixtures/makeSchema')
const commandHandlers = require('../../src/commandHandlers')
const makeCommand = require('../..')
makeCommand.setSchema(buildMakeSchema())
describe('command handler', () => {
  beforeEach(() => {
    let handlers = Object.keys(buildMakeSchema().commandHandlers)
    for (let handler of handlers) {
      commandHandlers.setHandlers(handler)
    }
  })
  it('must have a handleCreate command', () => {
    commandHandlers.handlers.handleCreate = undefined
    expect(() => commandHandlers.handlers.handleCreate({
      name: 'Pant trouses',
      price: 30,
      description: 'its actually nice',
      size: 30
    })).toThrow('commandHandlers.handlers.handleCreate is not a function')
  })
  it('must have a handleCreate command with a callback function', () => {
    expect(() => commandHandlers.handlers.handleCreate({
      name: 'Pant trouses',
      price: 30,
      description: 'its actually nice',
      size: 30
    })).toThrow('handler must have a callback function, try adding a callback function as the second parameter to the handleCreate command handler ')
  })

  it('must have a handleCreate command with a callback with a funtion type', () => {
    expect(() => commandHandlers.handlers.handleCreate({
      name: 'Pant trouses',
      price: 30,
      description: 'its actually nice',
      size: 30
    },
    {
      text: 'this should have been a function'
    })).toThrow('handler must have a callback function, try adding a callback function as the second parameter to the handleCreate command handler ')
  })
  it('must have a handleCreate command with a command object', () => {
    expect(() => commandHandlers.handlers.handleCreate('this should be an object'
      , function () {})).toThrow('command expected to be an object but saw a string at handleCreate command ')
  })
  it('must have command handler that is not handleCreate which takes in a command as the second parameter and its an object type ', () => {
    expect(() => commandHandlers.handlers.handleChangeName(
      'abc-wec-fgs-kirhf',
      1,
      function () {})).toThrow('command expected to be an object but saw a number at handleChangeName command ')
  })

  it('must have command handler that is not handleCreate which takes in a callback as the third parameter and its a function type ', () => {
    expect(() => commandHandlers.handlers.handleChangeName(
      'abc-wec-fgs-kirhf',
      {
        name: 'alobe shirt'
      },
      'this should be a function')).toThrow('handler must have a callback function, try adding a callback function as the third parameter to the handleChangeName command handler ')
  })
})
