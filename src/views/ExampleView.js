
    const makeCommand = require('../node_modules/node-cqrs/index')
    let ExampleView = new makeCommand.View()
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
    
    
    