const express = require('express');
const router = express.Router();

// Home route
router.get('/', (req, res) => {
  res.render('index');
});

// Fitness route
router.get('/fitness', (req, res) => {
  res.render('fitness');
});

// Shop route
router.get('/shop', (req, res) => {
  console.log('Request received for /shop'); // Log the request
  res.render('shop', (err, html) => {
    if (err) {
      console.error('Error rendering shop page:', err); // Log rendering errors
      res.status(500).send('Error rendering shop page');
    } else {
      res.send(html);
    }
  });
});

module.exports = router;
