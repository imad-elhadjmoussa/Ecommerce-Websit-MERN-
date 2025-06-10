require('dotenv').config();
const express = require('express');
const passport = require('passport');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


// Google callback
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: "https://ecommerce-websit-mern.onrender.com"
    }),
    (req, res) => {
        console.log('Google callback successful, user:', req.user);
        
        // Explicitly set the user in the session
        req.session.user = req.user;
        
        // Save session and handle any errors
        req.session.save((err) => {
            if (err) {
                console.error('Error saving session:', err);
                return res.redirect("https://ecommerce-websit-mern.onrender.com");
            }
            
            // Verify session was saved
            console.log('Session after save:', {
                id: req.session.id,
                hasUser: !!req.session.user,
                user: req.session.user ? {
                    id: req.session.user.id,
                    email: req.session.user.email
                } : null
            });
            
            res.redirect("https://ecommerce-websit-mern.onrender.com");
        });
    }
);

router.get('/user', (req, res) => {
    console.log('User route - Session state:', {
        sessionID: req.session?.id,
        hasSessionUser: !!req.session?.user,
        hasPassportUser: !!req.user,
        passportUser: req.user ? {
            id: req.user.id,
            email: req.user.email
        } : null
    });

    if (req.user) {
        res.json({
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
            avatar: req.user.avatar,
            isAdmin: req.user.isAdmin || false
        });
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.clearCookie('connect.sid'); // optionally clear session cookie
        res.json({ message: 'Logged out successfully' });
    });
});

module.exports = router;
