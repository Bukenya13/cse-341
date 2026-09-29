const express = require('express');
const passport = require('../config/passport');
const router = express.Router();

router.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/api-docs/' }),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    }
);

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        if (req.session) {
            req.session.user = null;
        }

        res.redirect('/');
    });
});

module.exports = router;