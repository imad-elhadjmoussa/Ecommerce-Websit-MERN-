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
        successRedirect: "https://ecommerce-websit-mern.onrender.com",
        failureRedirect: "https://ecommerce-websit-mern.onrender.com"
    })
);

router.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        // Send back only the necessary user data
        res.json({
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
            avatar: req.user.avatar, // if coming from Google
            isAdmin: req.user.isAdmin || false // assuming isAdmin is a field in your user model
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
