const fs = require('fs')
const path = require('path')

let filterdpath = __dirname.search('node_modules')

let rootpath = __dirname.slice(0, filterdpath)

fs.mkdir(path.join(rootpath, 'setup'), () => {
  const globalConfigPath = path.join(rootpath, 'setup', 'setup.js')
  fs.writeFileSync(globalConfigPath, `
    let clevCQRS = require('clev-cqrs')
    const ExampleView2 = require('../views/ExampleView2')
    const ExampleView = require('../views/ExampleView')
    const eventStore = require('../eventstore/eventstore')
    let SchemaName = new clevCQRS.Schema({
        schemaName: 'schemaName e.g Product',
        fields: {
            //fields here
            //    e.g   name:{
            //          type:'string',
            //          required:true
            //          },
    
        },
        commandHandlers: {
            //handleCreate command handler is required
            handleCreate: function (yourEntityName, eventData) {
                eventData.id = yourEntityName.id //required
                // add other entity details here using example of this format
                // eventData.description=yourEntityName.description
                // eventDate.name = yourEntityName.name
            },
    
            // other command handlers here e.g
            // handleChangeName: function(product, eventData){
            //     eventData.name= product.name
            // },
    
        },
        eventStore: {
            methods: {
                get: eventStore.get, 
                delete:eventStore.delete, 
                getAll:eventStore.getAll,  
                save: eventStore.save,
            }
        },
        eventHandlers: {
    
            views: [ExampleView, ExampleView2]
        }
    
    })
    
    clevCQRS.setSchema(SchemaName)    
    `)
})

fs.mkdir(path.join(rootpath, 'views'), () => {
  const globalConfigPath = path.join(rootpath, 'views', 'ExampleView.js')
  fs.writeFileSync(globalConfigPath, `
    const clevCqrs = require('clev-cqrs')
    let ExampleView = new clevCQRS.View()
    //set handler for any event any event that is related to this view, this should relate to changes you want to make to the read database
    // for examplle if this a price view you might want to check for event that affect the name and price only
    ExampleView.setHandlers({
        handleCreate: function (yourEntityName, callback) {
            let itemToAddTODB = {
                id: yourEntityName.id,
                name: yourEntityName.name
    
            }
            // add itemToAddTODB to database
            // return a callback to show there are no errors  -required-
            callback(null)
        },


        
        // add other event handlers here for example
        // handleChangeName: function (user, callback) {
        //     update database
        //     callback(null)
        // },
    })
    
    
    module.exports = ExampleView
    
    
    `)

  const globalConfigPath2 = path.join(rootpath, 'views', 'ExampleView2.js')

  fs.writeFileSync(globalConfigPath2, `
    const clevCQRS = require('clev-cqrs')
    let ExampleView2 = new clevCQRS.View()
    //set handler for any event any event that is related to this view, this should relate to changes you want to make to the read database
    // for example if this a product details view you might want to check for event that affect all attribute of the product
    ExampleView2.setHandlers({
        handleCreate: function (yourEntityName, callback) {
            

            let itemToAddTODB = {
                id: yourEntityName.id,
                name: yourEntityName.name,

    
            }



            // add itemToAddTODB to database
            // return a callback to show there are no errors  -required-
            callback(null)
        },
        // add other event handlers here for example
        // handleChangeName: function (product, callback) {
        //     update database
        //     callback(null)
        // },
    })
    
    
    module.exports = ExampleView2
    
    
    `)
})

fs.mkdir(path.join(rootpath, 'eventstore'), () => {
  const globalConfigPath = path.join(rootpath, 'eventstore', 'eventstore.js')
  fs.writeFileSync(globalConfigPath, `
    let eventStore = {
        
        get: async function (id) {
        
            //  find object by id from database and return it
    
    
        },
        delete: async function (id) {
           // delete object by its id from database
    
    
        },
        getAll: async function () {
          // get all data as array from database  and return it
    
        },
        save: async function (event) {
          // save an object to database  
        }
    
    }


    module.exports = eventStore
    `)
})
