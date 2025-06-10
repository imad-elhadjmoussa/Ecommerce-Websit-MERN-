const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://ecommerce-websit-mern-backend.onrender.com/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google strategy - profile:', {
            id: profile.id,
            email: profile.emails[0].value,
            displayName: profile.displayName
        });

        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
            const isAdmin = email === process.env.ADMIN_EMAIL;
            user = new User({
                username: profile.displayName,
                email,
                avatar: profile.photos[0].value,
                isAdmin,
                provider: 'google',
                password: isAdmin ? process.env.ADMIN_PASSWORD : undefined,
            });

            await user.save();
            console.log('New user created:', { id: user.id, email: user.email });
        } else {
            console.log('Existing user found:', { id: user.id, email: user.email });
        }

        return done(null, user);
    } catch (err) {
        console.error('Google strategy error:', err);
        return done(err, null);
    }
}));

// Serialize user to the session
passport.serializeUser((user, done) => {
    console.log('Serializing user:', { id: user.id, email: user.email });
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        console.log('Deserializing user:', { id });
        const user = await User.findById(id);
        if (!user) {
            console.log('User not found during deserialization');
            return done(null, false);
        }
        console.log('User deserialized:', { id: user.id, email: user.email });
        done(null, user);
    } catch (err) {
        console.error('Deserialization error:', err);
        done(err, null);
    }
});

