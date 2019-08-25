const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('./config');
const app = express();
let googleProfile = {};

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, cb) {
    googleProfile = {
      id: profile.id,
      displayName: profile.displayName
    };
    cb(null, profile);
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
  succesRedirect: '/logged',
  // succesRedirect: console.log('logged'),
  failureRedirect: '/'
  // failureRedirect: console.log('not_logged')
}));

app.listen(3000);

// app.use(function(req, res, next) {
//   res.status(404).send('Sorry we cannot handle your request..');
// });
