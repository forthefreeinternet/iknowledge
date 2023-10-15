const categoryModel = require('../models/categoryModel')
// const initModel = require('../models/initModel')
// const subscriptionModel = require('../models/subscriptionModel');
// const Web3 = require('web3')
// function User(){

// }

// function user(accountName,
//     email,
//     password){
//         this.accountName = accountName
//         this.email = email
//         this.password = password
// }

const categoryService = {
    
    create: async function(userId){
        let video = await categoryModel.create(userId)
        return video
    },
    add: async () => {

        },

    // find: async function(accountName)  {
    //     return await userModel.findByName(accountName)
    // },

    // findById: async function(accountAddress) {
    //     this._id = accountAddress
    //     this.user = await userModel.findById(accountAddress)
    //     console.log('this binding', this)
    //     return this
    // },

    // populate: async function(field){
    //     console.log('want to find', field)
    //     let result
    //     switch (field){
    //         case 'subscribers':
    //             result = await subscriptionModel.findByChannelId(this._id)                
    //     }
    //     this.user.subscribers = result
    //     return this.user
        

    // },
    
    category: null,

    _id: null,

    find: async function(arg){
        return await categoryModel.find(arg)
    },

    countDocuments: async function(arg){
        return await categoryModel.countDocuments(arg)
    },

}

module.exports =  categoryService