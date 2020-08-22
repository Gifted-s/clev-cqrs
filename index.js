const Schema = require('./src/schema')
const { View } = require('./src/handlers')

let makeCommand = (function () {
  let _this = {}
  _this.schema = {}
  _this.setSchema = function (Schema) {
    _this.schema = Schema
  }
  _this.Schema = Schema
  _this.View = View
  const commandHandlers = require('./src/commandHandlers')
  _this.eventStore = require('./src/eventStore') || []
  _this.schemaName = _this.schema.schemaName || 'unknown'
  _this.handler = commandHandlers.handlers
  return _this
})()
module.exports = makeCommand
