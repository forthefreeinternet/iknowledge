const videoModel = require('../models/videoModel')
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

const videoService = {
    
    create: async function(userId){
        let video = await videoModel.create(userId)
        return video
    },
    add: async () => {

        },

    upload: async function(video, API_token, callback){
        console.log(API_token),
        await videoModel.upload_local(video)
        callback()
    },

    findById: async function(id){
        let video = await videoModel.findById(id)
        return video
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
    
    video: null,

    _id: null,

}

module.exports =  videoService