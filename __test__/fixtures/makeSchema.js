const makeCommand = require("../..");
const eventStore = require('./eventstore/eventStore')
const ProductPriceView = require('./viewss/ProductPriceView')
const ProductDetailsView = require('./viewss/ProductDetailsView')
module.exports = function buildMakeCommand({...props} = {}){
    let ProductSchema = new makeCommand.Schema({
        schemaName : 'Product',
        fields: {
            name:{
                type:'string',
                required:true
            },
            description:{
                type:'string',
                required:false
            },
            price:{
                type:'number',
                required:true
            },
            size:{
                type:'number',
                required:false
            }
    
        },
        commandHandlers:{
            handleCreate: function(product, eventData){
              eventData.id = product.id
              eventData.description=product.description
              eventData.name = product.name
              eventData.price= product.price
              eventData.size = product.size
            },
            handleChangeName: function(product, eventData){
                eventData.name= product.name
            },
            handleChangeDescription: function(product, eventData){
                eventData.description= product.description
            },
            handleChangePrice: function (product, eventData) {
                eventData.price= product.price
            },
            handleChangeSize : function (product, event) {
                event.size= product.size
            }
        },
        eventStore: {
            methods:{
                get: eventStore.get,
                delete:eventStore.delete,
                getAll:eventStore.getAll,
                save: eventStore.save
            }
        },
        eventHandlers: {
            views: [ProductDetailsView, ProductPriceView]
        },
    
      ...props
    })
    return ProductSchema
}
