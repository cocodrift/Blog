const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User'); // Adjust path as necessary
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    // Match user
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: 'That email is not registered' });
      }
  
      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      });
    });
  }));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
