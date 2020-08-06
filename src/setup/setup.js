
    let nodeCQRS = require('../node_modules/node-cqrs/index')
    const ExampleView2 = require('../views/ExampleView2')
    const ExampleView = require('../views/ExampleView')
    const eventStore = require('../eventstore/eventstore')
    let SchemaName = new nodeCQRS.Schema({
        schemaName: 'schemaNAme e.g Product',
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
    
    nodeCQRS.setSchema(SchemaName)    
    