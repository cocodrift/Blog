const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// Index route
router.get('/', async (req, res) => {
    const posts = await Post.find().sort({ createdAt: 'desc' });
   res.render('index', { posts });
  });

  router.get('/new', (req, res) => {
    res.render('new');
  });

  router.get('/terms', (req, res) => {
    res.render('terms');
  });

  router.get('/policy', (req, res) => {
    res.render('policy ');
  });
module.exports = router;
