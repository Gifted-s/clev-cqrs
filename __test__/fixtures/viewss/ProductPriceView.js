let mongodb = require('mongodb')
let nodeCQRS = require('../../../index')
let MongoClient = mongodb.MongoClient

let client = new MongoClient('mongodb://127.0.0.1:27017', { useNewUrlParser: true, useUnifiedTopology: true })

async function makeDb() {
    if (!client.isConnected()) {
        await client.connect()
    }
    return client.db('CProducts')
}



let ProductPriceView = new nodeCQRS.View()

ProductPriceView.setHandlers({
    handleCreate: function (product, callback) {
        makeDb().then(db => {
            db.collection('price').insert({
                id: product.id,
                name: product.name,
                price: product.price
            }).then(() => {
                return callback(null)
            })
        })

    },
    handleChangeName: function (product, callback) {
        makeDb().then(db => {
            db.collection('price').updateOne({
                id: product.id,
            }, { $set: { name: product.name } }).then(() => {
                return callback(null)
            })
        })

    },
    handleChangePrice: function (product, callback) {
        makeDb().then(db => {
            db.collection('price').updateOne({
                id: product.id,
            }, { $set: { price: product.price } }).then(() => {
                return callback(null)
            })
        })

    },


})


module.exports = ProductPriceView