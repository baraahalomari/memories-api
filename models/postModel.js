'use strict';
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  name : String,
  creator: { type: String },
  selectedFile: { type: String },
  tags: [String],
  likes: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const postMessage = mongoose.model('postMessage', postSchema);
module.exports = postMessage;