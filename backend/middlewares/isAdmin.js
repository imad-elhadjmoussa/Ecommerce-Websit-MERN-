const User = require('../models/user.model'); // Adjust the path as necessary
require('dotenv').config();

const isAdmin = async (req, res, next) => {
    const user = req.user;

    console.log(user)

    if (!user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        // Fetch full user from DB
        const dbUser = await User.findById(user._id);
        if (!dbUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is admin using the isAdmin field
        if (!dbUser.isAdmin) {
            return res.status(403).json({ message: 'Access denied: Not an admin user' });
        }

        // Verify admin credentials against environment variables
        if (dbUser.email !== process.env.ADMIN_EMAIL) {
            console.error('Admin email mismatch:', { 
                provided: dbUser.email, 
                expected: process.env.ADMIN_EMAIL 
            });
            return res.status(403).json({ message: 'Access denied: Invalid admin credentials' });
        }

        // Verify password if user has one (might be OAuth user)
        if (dbUser.password) {
            const isPasswordMatch = await dbUser.matchPassword(process.env.ADMIN_PASSWORD);
            if (!isPasswordMatch) {
                console.error('Admin password mismatch');
                return res.status(403).json({ message: 'Access denied: Invalid admin credentials' });
            }
        }

        // All checks passed - user is verified admin
        next();

    } catch (error) {
        console.error('Admin check failed:', error);
        return res.status(500).json({ message: 'Server error during admin check' });
    }
};

module.exports = isAdmin;
