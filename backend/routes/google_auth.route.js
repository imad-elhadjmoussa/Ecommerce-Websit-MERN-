require('dotenv').config();
const express = require('express');
const passport = require('passport');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// Google login
router.get('/google', (req, res, next) => {
    console.log('Google login attempt:', {
        sessionID: req.session?.id,
        hasSession: !!req.session,
        origin: req.headers.origin
    });
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })(req, res, next);
});

// Google callback
router.get('/google/callback',
    (req, res, next) => {
        console.log('Google callback received:', {
            sessionID: req.session?.id,
            hasSession: !!req.session,
            query: req.query
        });
        passport.authenticate('google', {
            failureRedirect:"https://ecommerce-websit-mern.onrender.com"
        })(req, res, next);
    },
    (req, res) => {
        console.log('Google callback successful:', {
            user: req.user ? {
                id: req.user.id,
                email: req.user.email
            } : null,
            sessionID: req.session?.id
        });

        // Save session explicitly
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.redirect(process.env.CLIENT_URL || "https://ecommerce-websit-mern.onrender.com");
            }
            
            // Set cookie options explicitly for Render
            res.cookie('sessionId', req.session.id, {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined,
                maxAge: 24 * 60 * 60 * 1000
            });

            res.redirect(process.env.CLIENT_URL || "https://ecommerce-websit-mern.onrender.com");
        });
    }
);

router.get('/user', (req, res) => {
    console.log('User route accessed:', {
        sessionID: req.session?.id,
        hasSession: !!req.session,
        hasUser: !!req.user,
        cookies: req.headers.cookie ? 'present' : 'missing'
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
        res.status(401).json({ 
            message: 'Not authenticated',
            session: !!req.session,
            sessionID: req.session?.id
        });
    }
});

// Logout
router.get('/logout', (req, res) => {
    console.log('Logout attempt:', {
        sessionID: req.session?.id,
        hasUser: !!req.user
    });

    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }
        
        // Clear session and cookies
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destroy error:', err);
            }
            res.clearCookie('sessionId', {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
            });
            res.json({ message: 'Logged out successfully' });
        });
    });
});

module.exports = router;
