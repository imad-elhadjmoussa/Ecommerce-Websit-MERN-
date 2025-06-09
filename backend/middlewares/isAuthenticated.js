function isAuthenticated(req, res, next) {
    // Support both: Passport-authenticated or session-based users
    if ((req.isAuthenticated && req.isAuthenticated()) || req.session?.user) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized: Please log in first.' });
}

module.exports = isAuthenticated;
