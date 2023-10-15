const subscriptionModel = {
    model : null,

    findByChannelId : async function(id){
        let subscribers = await this.model
        .where({ channelId: id })
        .toArray()

        return subscribers

    }
}

// const mongoose = require('mongoose')

// const Schema = mongoose.Schema

// const SubscriptionSchema = new Schema(
//   {
//     subscriberId: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'User',
//       required: [true, 'Subscriber id is required']
//     },
//     channelId: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'User',
//       required: true
//     }
//   },
//   { timestamps: true }
// )

// module.exports = mongoose.model('Subscription', SubscriptionSchema)

module.exports = subscriptionModel
