const express = require('express');
const passport = require('../config/passport');
const router = express.Router();

const requireGitHub = (req, res, next) => {
    if (!passport.isGitHubConfigured()) {
        return res.status(503).json({
            message: 'GitHub login is not configured on this server. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.'
        });
    }
    return next();
};

router.get(
    '/login',
    requireGitHub,
    (req, res, next) => {
        passport.authenticate('github', {
            scope: ['user:email'],
            callbackURL: passport.callbackURLFor(req)
        })(req, res, next);
    }
);

router.get(
    '/github/callback',
    requireGitHub,
    (req, res, next) => {
        passport.authenticate('github', {
            callbackURL: passport.callbackURLFor(req),
            failureRedirect: '/api-docs/'
        })(req, res, next);
    },
    (req, res) => {
        res.redirect('/');
    }
);

router.get(
    '/auth/github/callback',
    requireGitHub,
    (req, res, next) => {
        passport.authenticate('github', {
            callbackURL: passport.callbackURLFor(req),
            failureRedirect: '/api-docs/'
        })(req, res, next);
    },
    (req, res) => {
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