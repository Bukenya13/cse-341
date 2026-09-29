const requireAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ message: 'You must be logged in to access this route.' });
};

module.exports = requireAuth;