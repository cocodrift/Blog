const express = require('express');
const router = express.Router();
const app = express();

// Home route
router.get('/', (req, res, next) => {
  try {
    res.render('index');
  } catch (error) {
    next(error);
  }
});

// Fashion route
router.get('/fashion', (req, res, next) => {
  try {
    res.send('Hello, this page is in development');
  } catch (error) {
    next(error);
  }
});

// Corrected route handler for /travel
router.get('/travel', (req, res, next) => {
  try {
    res.render('travel');
  } catch (error) {
    next(error);
  }
});

// Fitness route
router.get('/fitness', (req, res, next) => {
  try {
    res.render('fitness');
  } catch (error) {
    next(error);
  }
});

// Shop route
router.get('/shop', (req, res, next) => {
  try {
    res.render('shop');
  } catch (error) {
    next(error);
  }
});

// Add route
router.get('/add', (req, res) => {
  res.render('add');
});

router.post('/add', async (req, res) => {
  const { title, content } = req.body;
  try {
    const newPost = new Post({ title, content });
    await newPost.save();
    res.redirect('/shop');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/shop', (req, res) => {
  const posts = [] // Fetch posts from somewhere (e.g., database)
  res.render('shop', { posts: posts });
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Mount the router
app.use(router);

// Export the app (optional, depends on your setup)
module.exports = app;
