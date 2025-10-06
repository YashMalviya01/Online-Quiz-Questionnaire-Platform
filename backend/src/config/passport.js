const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const User = require('../models/User');

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists
          let user = await User.findOne({ oauthId: profile.id, oauthProvider: 'google' });

          if (!user) {
            // Check if email exists
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
              // Link OAuth to existing account
              user.oauthProvider = 'google';
              user.oauthId = profile.id;
              user.profilePicture = profile.photos[0]?.value;
              user.emailVerified = true;
              await user.save();
            } else {
              // Create new user
              user = await User.create({
                username: profile.displayName.replace(/\s+/g, '_').toLowerCase(),
                email: profile.emails[0].value,
                password: Math.random().toString(36).slice(-8), // Random password (won't be used)
                oauthProvider: 'google',
                oauthId: profile.id,
                profilePicture: profile.photos[0]?.value,
                emailVerified: true,
                role: 'student'
              });
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// Microsoft OAuth Strategy
if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: process.env.MICROSOFT_CALLBACK_URL || '/api/auth/microsoft/callback',
        scope: ['user.read']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists
          let user = await User.findOne({ oauthId: profile.id, oauthProvider: 'microsoft' });

          if (!user) {
            // Check if email exists
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
              // Link OAuth to existing account
              user.oauthProvider = 'microsoft';
              user.oauthId = profile.id;
              user.profilePicture = profile.photos[0]?.value;
              user.emailVerified = true;
              await user.save();
            } else {
              // Create new user
              user = await User.create({
                username: profile.displayName.replace(/\s+/g, '_').toLowerCase(),
                email: profile.emails[0].value,
                password: Math.random().toString(36).slice(-8), // Random password (won't be used)
                oauthProvider: 'microsoft',
                oauthId: profile.id,
                profilePicture: profile.photos[0]?.value,
                emailVerified: true,
                role: 'student'
              });
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

module.exports = passport;
