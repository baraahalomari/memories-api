const express = require('express');
const PostMessage = require('../models/postModel')
const mongoose = require('mongoose');

const router = express.Router();

const auth = require('../middleware/auth');

const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PostMessage.findById(id);
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
  }
}

const getPosts = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT
    const total = await PostMessage.countDocuments({});

    const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
    res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

const fetchPostBySearchQuery = async (req, res) => {
  const { searchQuery, tags } = req.query;
  console.log(searchQuery, tags)
  try {
    const title = new RegExp(searchQuery, 'i');
    const post = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });
    console.log(post)
    res.json({ data: post });
  } catch (error) {
    console.log(error)
  }
}


const createPosts = async (req, res) => {
  const post = req.body;
  const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });

  try {
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
  if (!req.userId) return res.status(400).json({ message: 'user not authentication' });
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with this id');
  const post = await PostMessage.findById(id);
  const index = post.likes.findIndex((id) => id === String(req.userId));
  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
  res.json(updatedPost)
}

router.get('/:id', getPost)
router.get('/', getPosts)
router.get('/search', fetchPostBySearchQuery)
router.post('/', auth, createPosts)
router.put('/:id', auth, updatePost)
router.delete('/:id', auth, deletePost)
router.put('/:id/like', auth, likePost)


module.exports = router;