const User = require('../models/user.model'); // adjust path if needed
require('dotenv').config(); // only if not already loaded elsewhere

const register = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const isAdmin =
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD;

        user = new User({
            email,
            password,
            username,
            isAdmin
        });

        await user.save();

        // Store in session
        req.session.user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            avatar: user.avatar
        };

        res.status(201).json({
            message: "Registered successfully",
            user: req.session.user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password)))
            return res.status(400).json({ message: "Invalid credentials" });

        // Store in session
        req.session.user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            avatar: user.avatar
        };

        res.json({
            message: "Logged in successfully",
            user: req.session.user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out successfully" });
    });
};



const isAuthenticated = async (req, res) => {
    console.log(req.session.user); // Debugging line to check session data
    if (req.session.user) {
        // extract user data from the session
        const userId = req.session.user._id; // Assuming userId is stored in session
        const user = await User.findById(userId, { _password: 0 });
        res.json({ user });
    } else {
        res.json({ user: null, message: "Not authenticated" });
    }
};

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Admin login attempt:', {
            email,
            hasPassportUser: !!req.user,
            hasSession: !!req.session,
            hasSessionUser: !!req.session?.user
        });

        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(400).json({ msg: "Invalid admin credentials" });
        }

        // Create or find the admin user
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                email,
                password,
                username: "Admin",
                isAdmin: true
            });
            await user.save();
        }

        // Clear passport user if exists (do this before session operations)
        if (req.user) {
            await new Promise((resolve) => {
                req.logout((err) => {
                    if (err) console.error('Error logging out passport user:', err);
                    resolve();
                });
            });
        }

        // Store admin user in session
        req.session.user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: true,
            avatar: user.avatar
        };

        // Save session explicitly
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ message: "Failed to save admin session" });
            }

            console.log('Admin login successful:', {
                userId: user._id,
                sessionId: req.session.id,
                isAdmin: true,
                hasPassportUser: !!req.user,
                hasSessionUser: !!req.session?.user
            });

            // Set cookie explicitly
            res.cookie('connect.sid', req.session.id, {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000,
                path: '/',
                domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
            });

            res.json({
                message: "Admin logged in successfully",
                user: req.session.user
            });
        });
    } catch (err) {
        console.error('Admin login error:', err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    register,
    login,
    logout,
    isAuthenticated,
    adminLogin
};
