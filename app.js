const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
    
const app = express();
  
  // Set the views directory
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
  
  // Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Connect to MongoDB
mongoose.connect('mongodb+srv://vercel-admin-user:sivSaoPxiP2LzSKo@app1.vx2gtlp.mongodb.net/Blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


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
