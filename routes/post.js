const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// Show post
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('post', { post });
});

// Add comment
router.post('/:id/comments', async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push({ body: req.body.comment, date: new Date() });
  await post.save();
  res.redirect(`/posts/${post._id}`);
});

module.exports = router;
