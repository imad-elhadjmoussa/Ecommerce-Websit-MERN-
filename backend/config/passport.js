const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://ecommerce-websit-mern-backend.onrender.com/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // Set admin status based on email
            const isAdmin = email === process.env.ADMIN_EMAIL; // or check in a whitelist array

            user = new User({
                username: profile.displayName,
                email,
                avatar: profile.photos[0].value,
                isAdmin, // Add this field in your User schema
                provider: 'google',
                password: isAdmin ? process.env.ADMIN_PASSWORD : undefined,
            });

            await user.save();
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

