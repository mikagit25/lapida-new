const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('./models/User');


// --- OAuth стратегии временно отключены ---
/*
// Google
passport.use(new GoogleStrategy({ ... }));
// Facebook
passport.use(new FacebookStrategy({ ... }));
// Apple
passport.use(new AppleStrategy({ ... }));
// LinkedIn
passport.use(new LinkedInStrategy({ ... }));
*/

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
