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



let ProductDetailsView = new nodeCQRS.View()

ProductDetailsView.setHandlers({
    handleCreate: function (product, callback) {
        makeDb().then(db => {
            db.collection('details').insert({
                id: product.id,
                name: product.name,
                description: product.description,
                size: product.size,
                price: product.price
            }).then(() => {
                return callback(null)
            })
        })

    },
    handleChangeName: function (product, callback) {
        makeDb().then(db => {
            db.collection('details').updateOne({
                id: product.id,
            }, { $set: { name: product.name } }).then(() => {
                return callback(null)
            })
        })

    },
    handleChangeDescription: function (product, callback) {
        makeDb().then(db => {
            db.collection('details').updateOne({
                id: product.id,
            }, { $set: { description: product.description } }).then(() => {
                return callback(null)
            })
        })

    },
    handleChangePrice: function (product, callback) {
        makeDb().then(db => {
            db.collection('details').updateOne({
                id: product.id,
            }, { $set: { price: product.price } }).then(() => {
                return callback(null)
            })
        })

    },
    handleChangeSize: function (product, callback) {
        makeDb().then(db => {
            db.collection('details').updateOne({
                id: product.id,
            }, { $set: { size: product.size } }).then(() => {
                return callback(null)
            })
        })

    }

})


module.exports = ProductDetailsView