// middlewares/attachUser.js

const attachUser = async (req, res, next) => {
    try {
        // Log session state
        console.log('Session state:', {
            hasSession: !!req.session,
            sessionID: req.session?.id,
            hasUser: !!req.user,
            hasSessionUser: !!req.session?.user
        });

        if (req.user) {
            console.log('User already attached to request:', req.user);
            // Passport user already available
            return next();
        }

        if (req.session?.user) {
            console.log('Attaching user from session:', req.session.user);
            req.user = req.session.user;
            return next();
        }

        // If we get here, no user is attached
        console.log('No user found in session or passport');
        req.user = null;
        next();
    } catch (err) {
        console.error('Error in attachUser middleware:', err);
        req.user = null;
        next(); // Let route handler deal with it if needed
    }
};

module.exports = attachUser;
