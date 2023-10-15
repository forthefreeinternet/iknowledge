// const mongoose = require('mongoose')
// const uniqueValidator = require('mongoose-unique-validator')
let Dexie = require('dexie').default

// const Schema = mongoose.Schema

const CategoryModel ={
    init: function(name){
        let categoryDb = new Dexie(name + 'category');
        categoryDb.version(1).stores({
            categories: 'userId', // Primary key and indexed props
        });
        this.model = categoryDb.categories
        this.model.add(({id: 0, userId : '', title: 'College Math', description: 'Higher mathematics', createdAt: 0 }))
    },
    find: async function(argument){
        console.log(argument)
        return new categories([{title: 'College Math',
        description: 'Higher mathematics',
        createdAt: 0 }])
    },
    countDocuments: async function(arg){
        console.log(arg)
        return 1
    },
    
    model: null
}

function categories(arr){
    this.arr=arr
}

categories.prototype.sort= function(rule){
    this.arr.sort((a, b) => {
        for (const key in rule) {
          if (a[key] < b[key]) return -rule[key];
          if (a[key] > b[key]) return rule[key];
        }
        return 0;
      });
    return this
}

categories.prototype.limit= function(limit){
    if (!Array.isArray(this.arr)) {
        return this; 
      }
    this.arr = this.arr.slice(0, limit);
    return this
}

categories.prototype.skip = function(startIndex){
    if (!Array.isArray(this.arr)) {
        return this;
      }
    this.arr = this.arr.slice(startIndex);
      
    return this;
}

// const CategorySchema = new Schema(
//   {
//     title: {
//       type: String,
//       minlength: [3, 'Title must be three characters long'],
//       trim: true,
//       unique: true,
//       uniqueCaseInsensitive: true,
//       required: [true, 'Title is required'],
//     },
//     description: {
//       type: String,
//       minlength: [3, 'Description must be three characters long'],
//       required: [true, 'Description is required'],
//     },
//     userId: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//   },
//   { timestamps: true }
// )

// CategorySchema.plugin(uniqueValidator, { message: '{PATH} already exists.' })

module.exports = CategoryModel
