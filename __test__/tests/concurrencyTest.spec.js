
const makeCommand = require('../..')
const makeSchema = require('../fixtures/makeSchema')
const eventStore = require('../../src/eventStore')
makeCommand.setSchema(makeSchema())
let store = require('../fixtures/eventstore/eventStore')

describe('Concurrency check', () => {
  beforeEach(() => store.clear())

  it('must not save an event if there is a version mismatch', () => {
    eventStore.save([
      {
        name: 'Dante Shoe',
        description: 'Its nice to wear especially in rainy season',
        price: 3000,
        size: 30,
        eventName: 'Create',
        eventId: 'e9ed4d50-d465-11ea-8552-bdb6f36223d212345',
        aggregateId: 'e9ecb110d465-11ea-8552-bdb6f36223d2-3439-4jdkflll',
        eventVersion: 1,
        eventTime: 159633447969678
      }
    ],
    0,
    'e9ecb110d465-11ea-8552-bdb6f36223d2-3439-4jdkflll',
    function (err, storedValue) {
      expect(err).toBe(null)
      expect(storedValue).toBeDefined()
      eventStore.save([
        {
          name: 'Regalia dress',
          description: 'Its nice to wear especially in rainy season',
          price: 3000,
          size: 30,
          eventName: 'changeName',
          eventId: 'e9ed4d50-d465-11ea-8552-bdb6f36223d212345',
          aggregateId: 'e9ecb110d465-11ea-8552-bdb6f36223d2-3439-4jdkflll',
          eventVersion: 3, // this should be 2
          eventTime: 1596334476965
        }
      ],
      4, // this should be 1
      'e9ecb110d465-11ea-8552-bdb6f36223d2-3439-4jdkflll',
      function (err, storedvalue) {
        expect(storedvalue).toBe(undefined)
        expect(err).toEqual('Concurrency error. version mismatch')
      }
      )
    }
    )
  })
  it('must save an event if the version is sequential(there is no mismatch)', () => {
    eventStore.save([
      {
        name: 'Dante Shoe',
        description: 'Its nice to wear especially in rainy season',
        price: 3000,
        size: 30,
        eventName: 'Create',
        eventId: 'e9ed4d50-d465-11ea-8552-bdb6f36223d212345',
        aggregateId: 'e9ecb110d465-11ea-8552-bdb6f36223d2d-3439-4jdkflll',
        eventVersion: 1,
        eventTime: 1596334476965
      }
    ],
    0,
    'e9ecb110d465-11ea-8552-bdb6f36223d2d-3439-4jdkflll',
    function (err, storedValue) {
      expect(err).toBe(null)
      const expectedStoredObject = {
        id: 'e9ecb110d465-11ea-8552-bdb6f36223d2d-3439-4jdkflll',
        events: [
          {
            name: 'Dante Shoe',
            description: 'Its nice to wear especially in rainy season',
            price: 3000,
            size: 30,
            eventName: 'Create',
            eventId: 'e9ed4d50-d465-11ea-8552-bdb6f36223d212345',
            aggregateId: 'e9ecb110d465-11ea-8552-bdb6f36223d2d-3439-4jdkflll',
            eventVersion: 1,
            eventTime: 1596334476965
          },
          {
            name: 'Regalia dress',
            eventName: 'changeName',
            eventId: 'e9ed4d50-d465-11ea-8552-bdb6f36223d212345egyd',
            aggregateId: 'e9ecb110d465-11ea-8552-bdb6f36223d2d-3439-4jdkflll',
            eventVersion: 2,
            eventTime: 1596334476965
          }

        ]
      }

      expect(err).toBe(null)
      expect(storedValue).toBeDefined()
      eventStore.save([
        {
          name: 'Regalia dress',
          eventName: 'changeName',
          eventId: 'e9ed4d50-d465-11ea-8552-bdb6f36223d212345egyd',
          aggregateId: 'e9ecb110d465-11ea-8552-bdb6f36223d2d-3439-4jdkflll',
          eventVersion: 2,
          eventTime: 1596334476965
        }
      ],
      1,
      'e9ecb110d465-11ea-8552-bdb6f36223d2d-3439-4jdkflll',
      function (err, storedvalue) {
        expect(err).toBe(null)
        expect(storedvalue).toMatchObject(expectedStoredObject)
      }
      )
    }
    )
  })
})
