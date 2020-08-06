/* eslint-disable standard/no-callback-literal */
function compareType (type, input, callback) {
  if (type === 'array') {
    if (!Array.isArray(input)) {
      return callback('error', 'array')
    }
    return callback(null)
  }
  if (type === 'date') {
    if (typeof input !== 'string' && typeof input !== 'number') {
      return callback('error', 'date')
    }
    return callback(null)
  }
  if (type === 'buffer') {
    if (typeof input !== 'object') {
      return callback('error', 'buffer')
    }
    return callback(null)
  }
  if (type === 'mix') {
    return callback(null)
  }
  // eslint-disable-next-line valid-typeof
  if (type !== typeof input) {
    return callback('error', type)
  }
}

module.exports = compareType
