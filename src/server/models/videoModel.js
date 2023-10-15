let Dexie = require('dexie').default
const categoryModel = require('./categoryModel')
// const userModel = require('./userModel')

const videoModel ={
    create :  async function (userId) {

        // get an id 
        const time = new Date().getTime()
        let id = userId + time.toString

        await this.model.add({id:id , userId :userId})
        return new Video(id)
      },


    upload_local: async function(file){
      const fileBlob = new Blob([file], { type: 'application/octet-stream' });
      this.model.add({blob:fileBlob})

    },

    findByIdAndUpdate : async function (userId) {
      await this.model.add({userId :userId})
      return 
    },

    find: async function(argument){
      console.log(argument)
      if (! this.model){
        return new Videos([{_id:'_0',url:'test',id:'0', title:'test', categoryId:0, userId:'0',createdAt:0}])
      }
      let results = await this.model.where(argument).toArray()
      console.log(results)
      return new Videos([{id:0, title:'test', categoryId:0, userId:'0',createdAt:0}])
      // return new Videos(results)
    },
    findById: async function(id){
      console.log(id)
      if (! this.model){
        return new Videos([{_id:'_0',url:'test',id:'0', title:'test', categoryId:0, userId:'0',createdAt:0}])
      }
      let results = await this.model.where(id).first()
      console.log(results)
      return new Videos([{id:0, title:'test', categoryId:0, userId:'0',createdAt:0}])
      // return new Videos(results)
    },
    countDocuments: async function(arg){
        console.log(arg)
        return 1
    },

    model: null,

    init: function(name){
      let videoDb = new Dexie(name + 'video');
      videoDb.version(1).stores({
        videos: 'id, userId', // Primary key and indexed props
      });
      this.model = videoDb.videos
      // this.model.add(({userId : '', title: 'College Math', description: 'Higher mathematics', createdAt: 0 }))
    }
}

function Video(id){
  this._id = id
  this.id = id
}

Video.prototype.remove = function(){

}

function Videos(arr){
  this.arr=arr
}

Videos.prototype.sort= function(rule){
  this.arr.sort((a, b) => {
      for (const key in rule) {
        if (a[key] < b[key]) return -rule[key];
        if (a[key] > b[key]) return rule[key];
      }
      return 0;
    });
  return this
}

Videos.prototype.limit= function(limit){
  if (!Array.isArray(this.arr)) {
      return this; 
    }
  this.arr = this.arr.slice(0, limit);
  return this
}

Videos.prototype.skip = function(startIndex){
  if (!Array.isArray(this.arr)) {
      return this;
    }
  this.arr = this.arr.slice(startIndex);
    
  return this;
}

Videos.prototype.populate = async function(field){
  console.log('want to find', field)
  for (const video of this.arr) {
    let category
    // let user
    switch (field.path) {
      case 'subscribers':
        // const subscribers = await subscriptionModel.findByChannelId(video.id);
        // this.user.subscribers = subscribers;
        break;
      case 'likes':
        // 处理 'likes' 字段的填充逻辑
        // const likes = await someFunctionToGetLikes(video.id);
        // video.likes = likes
        // populatedData.likes = likes;
        break;
      case 'dislikes':
        // 处理 'dislikes' 字段的填充逻辑
        // 例如：const dislikes = await someFunctionToGetDislikes(this._id);
        // populatedData.dislikes = dislikes;
        break;
      case 'categoryId':
        category = await categoryModel.find(video.categoryId);
        video.category = category
        break
      case 'userId':
        // user = await userModel.find(video.userId);
        video.userId = {_id: '0'}
        break
      // 可以继续添加其他字段的处理逻辑
    }
  }
  // this.user.subscribers = result
  return this
  

},

module.exports = videoModel