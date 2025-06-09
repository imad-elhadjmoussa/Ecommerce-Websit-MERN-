const User = require('../models/user.model'); // Adjust the path as necessary

const isAdmin = async (req, res, next) => {
    const user = req.user;

    console.log(user)

    if (!user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        // Check if user's email matches the admin email
        if (user.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ message: 'Access denied: Not an admin email' });
        }

        // Fetch full user from DB (to get hashed password)
        const dbUser = await User.findById(user._id);
        if (!dbUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare stored admin hash (from env) with actual user's password
        const isPasswordMatch = await dbUser.matchPassword(process.env.ADMIN_PASSWORD);
        if (!isPasswordMatch) {
            return res.status(403).json({ message: 'Access denied: Invalid admin credentials' });
        }

        // User is admin
        next();

    } catch (error) {
        console.error('Admin check failed:', error);
        return res.status(500).json({ message: 'Server error during admin check' });
    }
};

module.exports = isAdmin;
