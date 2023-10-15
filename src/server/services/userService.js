const userModel = require('../models/userModel')
const initModel = require('../models/initModel')
const subscriptionModel = require('../models/subscriptionModel');
const Web3 = require('web3')
// function User(){

// }

// function user(accountName,
//     email,
//     password){
//         this.accountName = accountName
//         this.email = email
//         this.password = password
// }

const userService = {
    create: async ({channelName,
        email,
        password}) => {
            let accountName = channelName
            const time = new Date().getTime()
            // stringfy the accountName and password
            
            let entropy = accountName.toString() + email.toString() + password.toString() + time.toString();
            console.log('entropy : ' , entropy)
            for (let i = entropy.length ; i < 32 ; i++){
                entropy = entropy +"0";
            }
            var web3 = new Web3(Web3.givenProvider);//new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
            let account =  web3.eth.accounts.create([entropy]);
            entropy = web3.eth.accounts.encrypt(account.privateKey, entropy) 
            let account2 =  web3.eth.accounts.create([entropy]);
            //console.log( account);
            let accountAddress = account.address;
            let secPrivateKey = web3.eth.accounts.encrypt(account.privateKey, password)
            //localStorage.setItem($('#js_input').val(), JSON.stringify(this.$web3.eth.accounts.encrypt(account.privateKey, $('#js_input_password').val())));
            let info = {'channelName': accountName, 'email': email , 'id': accountAddress , 'secPrivateKey': secPrivateKey , 
            'contactList': {}, role : 'user' , publicId: account2.address , group: [{groupId: '0'}], avatar: 'https://github.com/forthefreeinternet/ichat/blob/master/src/assets/wallpaper.png'}
            // global.user = {
            //     username: accountName,
            //     userId : accountAddress,       
            //     password: password,
            //     privateKey : account.privateKey,
            //     avatar: 'https://github.com/forthefreeinternet/ichat/blob/master/src/assets/wallpaper.png',
            //     role: 'user',
            //     tag: '',
            //     //createTime: time,
            //     //publicId: account2.address,
            // }
            await initModel.init(accountAddress)
            let user = await userModel.create(accountName ,info)
            
            // await initController.serviceInit(accountAddress)
            return user
        
    },

    add: async () => {

        },

    // when log in, find the local account by email
    findOne: async function({email})  {
        let user =  await userModel.findByEmail(email)
        if (!user){
            return null
        }
        return await userModel.findByName(user.channelName)

    },

    // when register, check if the name has been used
    find: async function(accountName)  {
        return await userModel.findByName(accountName)
    },

    findById: async function(id) {
        this._id = id
        this.user = await userModel.findById(id)
        console.log('this binding', this)
        return this
    },

    populate: async function(field){
        console.log('want to find', field)
        let result
        switch (field){
            case 'subscribers':
                result = await subscriptionModel.findByChannelId(this._id)                
        }
        this.user.subscribers = result
        return this.user
        

    },
    
    user: null,

    _id: null,

}

module.exports =  userService