// const crypto = require('crypto')
const localforage = require('localforage')
const Web3 = require('web3')

// db.js

// local
// const Dexie = require('dexie');
// const mongoose = require('mongoose')

// const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// const uniqueValidator = require('mongoose-unique-validator')


//const Schema = mongoose.Schema

// function UserModel(){
//   // local
//   const db = new Dexie('userRepository');
//   db.version(1).stores({
//     friends: '&id, channelName, email, photoUrl, role, password', // Primary key and indexed props
//   });
//   this.Dexie = db
// }
const userModel = {


   findByName: async function(name) {
    let user = await localforage.getItem(name)
    user = JSON.parse(user)
    console.log('find user in localforage', user)
    if (user){
      return new User(user)
    } else{
      return user
    }
    
  },

  findById : async function(id) {
    console.log(this.model,id)
    let user = await this.model
    .where({ id: id })
    .first()
    console.log('find user in Dexie', user)
    if (user){
      return new User(user)
    } else{
      return user
    }
    
  },

  findByEmail : async function(email) {
    let user = await localforage.getItem(email)
    user = JSON.parse(user)
    console.log('find user in localforage', user)
    if (user){
      return new User(user)
    } else{
      return user
    }
    
  },

  create :  async function (channelName, info) {
    await localforage.setItem(channelName , JSON.stringify(info))
    await localforage.setItem(info.email , JSON.stringify(info))
    await this.add(info)
    return new User(info)
  },

  add : async function (info) {
    console.log('add to', this.model)
    await this.model.add({id :  info.id , channelName: info.channelName, email: info.email })
    return new User(info)
  },

  model : null


}

function User({id, email,channelName,password,secPrivateKey}){
  this.id = id
  this.email = email
  this.channelName = channelName
  this._id = id
  // this.email = email
  this.password = password
  this.secPrivateKey = secPrivateKey
}

User.prototype.getSignedJwtToken = function () {
  console.log(process.env)
  let token = jwt.sign({ id: this.id }, process.env.VUE_APP_JWT_SECRET, {
  expiresIn: process.env.VUE_APP_JWT_EXPIRE
  })
  const decoded = jwt.verify(token, process.env.VUE_APP_JWT_SECRET)
  console.log('jwt tet',decoded)
  return token
  

}

User.prototype.matchPassword = async function(password){
  // let  username = this.channelName
  // let privateKey
  // let localAccount = JSON.parse(localStorage.getItem(username));
  // let localAccount = JSON.parse(await localforage.getItem(username)); //the string typed in is the key mapped to a decrypted account,
  let account
  var web3 = new Web3(Web3.givenProvider);
  try{
    account = web3.eth.accounts.decrypt(this.secPrivateKey, password);
    //  privateKey = account.privateKey
  }catch{
    console.log("密码错误！");
    
    return false
  }
  console.log('matchPassword', account)
  return true
}

// const UserSchema = new Schema(
//   {
//     channelName: {
//       type: String,
//       required: [true, 'Please add a channel name'],
//       unique: true,
//       uniqueCaseInsensitive: true
//     },
//     email: {
//       type: String,
//       required: [true, 'Please add an email'],
//       unique: true,
//       uniqueCaseInsensitive: true,
//       match: [
//         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//         'Please add a valid email'
//       ]
//     },
//     photoUrl: {
//       type: String,
//       default: 'no-photo.jpg'
//     },
//     role: {
//       type: String,
//       enum: ['user', 'admin'],
//       default: 'user'
//     },
//     password: {
//       type: String,
//       required: [true, 'Please add a password'],
//       minlength: [6, 'Must be six characters long'],
//       select: false
//     },
//     resetPasswordToken: String,
//     resetPasswordExpire: Date
//   },
//   { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
// )

// UserSchema.index({ channelName: 'text' })

// UserSchema.virtual('subscribers', {
//   ref: 'Subscription',
//   localField: '_id',
//   foreignField: 'channelId',
//   justOne: false,
//   count: true,
//   match: { userId: this._id }
// })
// UserSchema.virtual('videos', {
//   ref: 'Video',
//   localField: '_id',
//   foreignField: 'userId',
//   justOne: false,
//   count: true
// })

// UserSchema.plugin(uniqueValidator, { message: '{PATH} already exists.' })

// UserSchema.pre('find', function () {
//   this.populate({ path: 'subscribers' })
// })

// // Ecrypt Password
// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     next()
//   }

//   const salt = await bcrypt.genSalt(10)
//   this.password = await bcrypt.hash(this.password, salt)
// })

// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password)
// }

// UserSchema.methods.getSignedJwtToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE
//   })
// }

// UserSchema.methods.getResetPasswordToken = function () {
//   // Generate token
//   const resetToken = crypto.randomBytes(20).toString('hex')

//   // Hash token and set to resetPasswordToken field
//   this.resetPasswordToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex')

//   // Set expire
//   this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

//   return resetToken
// }

// module.exports = mongoose.model('User', UserSchema)
module.exports = userModel