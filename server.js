const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('./config');
const app = express();
let googleProfile = {};

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    googleProfile = {
      id: profile.id,
      displayName: profile.displayName
    };
    done(null, profile);
  }
));

app.set('view engine', 'pug');
app.set('views', './views');
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  res.render('welcome', {user: req.user});
});

app.get('/logged', function(req, res) {
  res.render('logged', {user: googleProfile});
});

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/logged',
  failureRedirect: '/',
}));

// app.get('/logout', function(req, res) {
//   req.logout();
//   res.redirect()
// });

app.listen(3000);

app.use(function(req, res, next) {
  res.status(404).send('Sorry we cannot handle your request..');
});
