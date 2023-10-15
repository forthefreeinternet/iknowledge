let Dexie = require('dexie').default
const userModel = require('./userModel');
const subscriptionModel = require('./subscriptionModel');
// const categoryModel = require('./categoryModel');
const videoModel = require('./videoModel')


const init = function(name)  {
    let db = new Dexie(name + 'users');
    db.version(1).stores({
        users: '&id',//, channelName, email, photoUrl, role, password', // Primary key and indexed props
    });
    userModel.model = db.users

    let subscriptionsDb = new Dexie(name + 'subscriptions');
    subscriptionsDb.version(1).stores({
        subscriptions: 'subscriberId, channelId', // Primary key and indexed props
    });
    subscriptionModel.model = subscriptionsDb.subscriptions

    videoModel.init(name)

    
}

module.exports = {
    init
}
