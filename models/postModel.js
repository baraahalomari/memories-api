'use strict';
const mongoose = require('mongoose');

const postSchema =  mongoose.Schema({
  title: {type:String,required:true},
  message: {type:String,required:true},
  creator: {type:String,required:true},
  selectedFile: {type:String},
  tags: [String],
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const postMessage = mongoose.model('postMessage', postSchema);
module.exports=postMessage;