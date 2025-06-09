// middlewares/attachUser.js

const attachUser = async (req, res, next) => {
    try {
        if (req.user) {
            console.log('User already attached to request:', req.user);
            // Passport user already available
            return next();
        }

        if (req.session?.user) {
            console.log('Attaching user from session:', req.session.user);
            req.user = req.session.user;
        }

        

        next();
    } catch (err) {
        console.error('Error in attachUser middleware:', err);
        next(); // Let route handler deal with it if needed
    }
};

module.exports = attachUser;
