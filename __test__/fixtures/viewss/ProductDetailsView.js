
let nodeCQRS = require('../../../index')
let store = []

let ProductDetailsView = new nodeCQRS.View()

ProductDetailsView.setHandlers({
  handleCreate: function (product, callback) {
    store.push({
      id: product.id,
      name: product.name,
      description: product.description,
      size: product.size,
      price: product.price
    })
    return callback(null)
  },
  handleChangeName: function (product, callback) {
    let id = product.id
    let foundproduct = store.find(function (product) {
      return product.id === id
    })
    foundproduct.name = product.name
    return callback(null)
  },
  handleChangeDescription: function (product, callback) {
    let id = product.id
    let foundproduct = store.find(function (product) {
      return product.id === id
    })
    foundproduct.description = product.description
    return callback(null)
  },
  handleChangePrice: function (product, callback) {
    let id = product.id
    let foundproduct = store.find(function (product) {
      return product.id === id
    })
    foundproduct.price = product.price
    return callback(null)
  },
  handleChangeSize: function (product, callback) {
    let id = product.id
    let foundproduct = store.find(function (product) {
      return product.id === id
    })
    foundproduct.size = product.size
    return callback(null)
  }

})

module.exports = ProductDetailsView
