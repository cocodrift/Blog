require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./middleware/passportConfig');
const app = express();
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const port = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const mongoURI = 'mongodb+srv://vercel-admin-user:sivSaoPxiP2LzSKo@app1.vx2gtlp.mongodb.net/Blog';
mongoose.set('strictQuery', false); // Set strictQuery to false to prepare for Mongoose 7
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

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

// Routes for registration and login
app.get('/register', (req, res) => {
  res.render('register', { errors: [] });
});

app.post('/register', async (req, res) => {
  const { username, email, password, password2 } = req.body;
  let errors = [];

  if (!username || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      username,
      email,
      password,
      password2
    });
  } else {
    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          username,
          email,
          password,
          password2
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          username,
          email,
          password: hashedPassword
        });

        await newUser.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/login');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) { return next(err); }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
});

// Routes
const indexRoutes = require('./routes/index');
const postRoutes = require('./routes/posts');
const adminRoutes = require('./routes/admin');

const isAuthenticated = require('./middleware/isAuthenticated');
app.use('/', indexRoutes);
app.use('/posts', isAuthenticated, postRoutes);
app.use('/admin', isAuthenticated, adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', { message: err.message });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
