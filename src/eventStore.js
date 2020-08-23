/* eslint-disable standard/no-callback-literal */
'use strict'
const stream = require('stream')
const _ = require('lodash')
let eventStore = (function () {
  // eslint-disable-next-line no-unused-vars
  let _storedEvents = {}
  let _this = {}
  let storeMethods = {}
  storeMethods.getAll = function () {

  }
  /**
   * @param {object} store
   */
  _this.setStore = function (store) {
    for (let i of Object.keys(store).values()) {
      // checking if each key in store object was set to a function
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
  /**
 * @param {array} domainEvents
 * @param {number} version
 * @param {string} id
 * @param {function} callback
 */
  _this.save = function (domainEvents, version, id, callback) {
    // fiind the aggregate events by id
    findEventById(id)
      .then(storedEvent => {
        if (storedEvent) {
          // comparing the versions to know if there was a version mis-match which can lead to concurency error
          if (_.last(storedEvent.events).eventVersion !== version) {
            return callback('Concurrency error. version mismatch')
          }
          // Adding new events to existing ones
          domainEvents.forEach((event) => {
            storedEvent.events.push(event)
          })
          // delete previous events
          storeMethods.delete(id).then(() => {
            // save new events to database
            storeMethods.save(storedEvent).then(() => {
              // return callback function
              return callback(null, storedEvent)
            })
            // checking for error while saving
              .catch(err => {
                return callback(err.message, null)
              })
          })
        } else {
          // if aggregate does not exist,  create a new one
          storedEvent = {
            id,
            events: domainEvents
          }
          // save new events to database
          storeMethods.save(storedEvent).then(() => {
            // return callback function
            return callback(null, storedEvent)
          })// checking if there was an error
            .catch(err => {
              // retun callback with error message
              return callback(err.message, null)
            })
        }
      })
  }
  _this.get = function (id, callback) {
    findEventById(id)
      .then(storedEvent => {
        if (storedEvent) {
          // creating a PassThrought stream to pass in events fetched
          let eventStream = new stream.PassThrough({ objectMode: true })
          storedEvent.events.forEach(event => {
            // writing to event stream
            eventStream.write(event)
          })
          // ending write operation
          eventStream.end()
          // calling the callback function
          return callback(null, eventStream)
        }
      })
      // checking for error while fetching events
      .catch(err => {
        return callback(err.message, null)
      })
  }
  /**
   * @param {string} id
   */
  async function findEventById (id) {
    let item = await storeMethods.get(id)
    // checking if an aggregate of event was found
    if (item) {
      return item
    }
    return null
  }
  // return the this object
  return _this
})()
// exporting eventStore
module.exports = eventStore
