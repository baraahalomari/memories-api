const express = require('express');
const PostMessage = require('../models/postModel')
const mongoose = require('mongoose');

const router = express.Router();




const getPosts = async (req, res) => {
  try {
    const postMessage = await PostMessage.find();
    res.status(200).json(postMessage)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}


const createPosts = async (req, res) => {
  const post = req.body;
  const newPost = new PostMessage(post);

  try {
    console.log(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with this id');
  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true });
  res.json(updatedPost)
}

const deletePost = async (req, res) => {

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with this id');
  await PostMessage.findByIdAndRemove(id)
  res.status(202).send('Post Deleted')
}

const likePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with this id');
  const post = await PostMessage.findById(id);
  const updatedPost = await PostMessage.findByIdAndUpdate(id, { likes: post.likes + 1 }, { new: true });
  res.json(updatedPost)
}


router.get('/', getPosts)
router.post('/', createPosts)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)
router.put('/:id/like', likePost)


module.exports = router;