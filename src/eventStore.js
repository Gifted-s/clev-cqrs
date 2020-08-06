/* eslint-disable standard/no-callback-literal */

const stream = require('stream')
const _ = require('lodash')
let eventStore = (function () {
  // eslint-disable-next-line no-unused-vars
  let _storedEvents = {}
  let _this = {}
  let storeMethods = {}
  storeMethods.getAll = function () {

  }
  _this.setStore = function (store) {
    for (let i of Object.keys(store).values()) {
      if (typeof store[i] !== 'function') {
        throw new Error(`eventstore.${i} must be a function but saw a ${typeof store[i]}`)
      }
    }
    _this.getAll = store.getAll
    storeMethods['save'] = store.save
    storeMethods['get'] = store.get
    storeMethods['getAll'] = store.getAll
    storeMethods['delete'] = store.delete
  }

  _this.save = function (domainEvents, version, id, callback) {
    findEventById(id)
      .then(storedEvent => {
        if (storedEvent) {
          if (_.last(storedEvent.events).eventVersion !== version) {
            return callback('Concurrency error. version mismatch')
          }

          domainEvents.forEach((event) => {
            storedEvent.events.push(event)
          })

          storeMethods.delete(id).then(() => {
            storeMethods.save(storedEvent).then((res) => {
              if (res) {
                return callback(null, storedEvent)
              }
            })
          })

          // console.group(storedEvent)
        } else {
          storedEvent = {
            id,
            events: domainEvents
          }
          // console.group(storedEvent)
          storeMethods.save(storedEvent)
          return callback(null, storedEvent)
        }
      })
  }
  _this.get = function (id, callback) {
    findEventById(id)
      .then(storedEvent => {
        if (storedEvent) {
          let eventStream = new stream.PassThrough({ objectMode: true })
          storedEvent.events.forEach(event => {
            eventStream.write(event)
          })
          eventStream.end()
          return callback(null, eventStream)
        } else {
          return callback('error')
        }
      })
  }
  async function findEventById (id) {
    let item = await storeMethods.get(id)
    if (item) {
      return item
    }
    return null
  }

  return _this
})()

module.exports = eventStore
