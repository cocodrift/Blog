const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// Index route
router.get('/', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: 'desc' });
  res.render('index', { posts });
});

module.exports = router;
