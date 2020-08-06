
let store = []
let _= require('lodash')


let eventStore = Object.freeze({
    get: async function (id) {
  
        let event = _.find(store, (item)=> item.id = id )
        return event
    },
    delete: async function (id) {
        let filterd = store.filter(item=> item.id!== id)
        store= filterd
        return filterd
    },
    getAll: async function () {
        return store
    },
    save: async function (event) {
      store.push(event)
      
       return store
    },
    clear:function(){
        store= []
    }

})


module.exports = eventStore