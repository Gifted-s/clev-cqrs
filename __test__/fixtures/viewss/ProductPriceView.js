
let nodeCQRS = require('../../../index')

let store = []
let ProductPriceView = new nodeCQRS.View()

ProductPriceView.setHandlers({
  handleCreate: function (product, callback) {
    store.push({
      id: product.id,
      name: product.name,
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
  handleChangePrice: function (product, callback) {
    let id = product.id
    let foundproduct = store.find(function (product) {
      return product.id === id
    })
    foundproduct.price = product.price
    return callback(null)
  }

})

module.exports = ProductPriceView
