'use strict'
/*!
 * Copyright(c) 2020 Adewumi Sunkanmi
 * MIT Licensed
 */

/**
 * Get the Schema construnctor from the src directory
 */
const Schema = require('./src/schema')
/**
 * Ge the View contructor from the src directory
 */
const { View } = require('./src/handlers')
let makeCommand = (function () {
  let _this = {}
  _this.schema = {}
  /**
   * @param {object} Schema
   * the setSchema function sets the schema newly created to _this.schema
   */
  _this.setSchema = function (Schema) {
    _this.schema = Schema
    _this.schemaName = Schema.schemaName || 'unknown'
  }
  // _this.Schema is assign to the Schema contructor
  _this.Schema = Schema
  // _this.View is assigned to the View contructor
  _this.View = View
  const commandHandlers = require('./src/commandHandlers')
  // get the event store module
  _this.eventStore = require('./src/eventStore') || []
  // _this.handler is set to the comand handlers object
  _this.handler = commandHandlers.handlers
  // return the _this object
  return _this
})()
module.exports = makeCommand
