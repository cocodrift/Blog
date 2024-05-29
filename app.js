require('dotenv').config();
console.log('MongoDB URI:', process.env.MONGODB_URI);  // Add this line to debug

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');

// Routes
const indexRoutes = require('./routes/index');
const postRoutes = require('./routes/posts');
const adminRoutes = require('./routes/admin');

app.use('/', indexRoutes);
app.use('/posts', postRoutes);
app.use('/admin', adminRoutes);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
