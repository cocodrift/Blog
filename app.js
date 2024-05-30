require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./middleware/passportConfig');
const { errorHandler} = require('../middleware/common');
const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb+srv://vercel-admin-user:sivSaoPxiP2LzSKo@app1.vx2gtlp.mongodb.net/Blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
// Set up session with connect-mongo
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: mongoURI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Initialize connect-flash
app.use(flash());

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Set flash messages to response locals
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.get('/login', (req, res) => {
  try{
    res.render ('login');
  } catch (error) {
    next(error);
  }
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect('/login');
    req.logIn(user, (err) => {
      if (err) return next(err);
      console.log('User logged in:', user); // Log user details
      console.log('Session:', req.session); // Log session details
      return res.redirect('/admin');
    });
  })(req, res, next);
});

app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success_msg', 'You are logged out');
    req.session.destroy();
    res.redirect('/');
  });
});

// Routes
const indexRoutes = require('./routes/index');
const postRoutes = require('./routes/posts');
const adminRoutes = require('./routes/admin');

app.use('/',require('./middleware/isAuthenticated'), indexRoutes);
app.use('/posts',require('./middleware/isAuthenticated'), postRoutes);
app.use('/admin',require('./middleware/isAuthenticated'), adminRoutes);

app.use(errorHandler);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});








// Import routes


// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', { message: err.message });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
