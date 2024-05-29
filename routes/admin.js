const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// Index route
router.get('/', async (req, res) => {
    const posts = await Post.find().sort({ createdAt: 'desc' });
    res.render('home', { posts });
  });
  
// Admin index
router.get('/admin', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: 'desc' });
  res.render('admin', { posts });
});

// New post form
router.get('/new', (req, res) => {
  res.render('new');
});

// Create post
router.post('/', async (req, res) => {
  const post = new Post({ title: req.body.title, content: req.body.content });
  await post.save();
  res.redirect('/admin');
});

// Edit post form
router.get('/:id/edit', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('edit', { post });
});

// Update post
router.put('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.title = req.body.title;
  post.content = req.body.content;
  await post.save();
  res.redirect('/admin');
});

// Delete post
router.delete('/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});

module.exports = router;
