const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

const CALLBACK_PATH = '/auth/github/callback';

const githubConfigured = Boolean(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET);

const hostOf = (value) => {
    try {
        return new URL(value).host.toLowerCase();
    } catch {
        return null;
    }
};

const resolveCallbackURL = (req) => {
    const configured = (process.env.CALLBACK_URL || '').trim();
    if (configured) {
        return configured;
    }

    const requestHost = String((req && req.headers && req.headers.host) || '').toLowerCase();
    if (!requestHost) {
        return CALLBACK_PATH;
    }

    const protocol = req.secure || String(req.headers['x-forwarded-proto'] || '').toLowerCase() === 'https' ? 'https' : 'http';
    return `${protocol}://${requestHost}${CALLBACK_PATH}`;
};

if (githubConfigured) {
    passport.use(
        new GitHubStrategy(
            {
                clientID: GITHUB_CLIENT_ID,
                clientSecret: GITHUB_CLIENT_SECRET,
                callbackURL: CALLBACK_PATH
            },
            (accessToken, refreshToken, profile, done) => {
                return done(null, profile);
            }
        )
    );
} else {
    console.warn(
        'GITHUB_CLIENT_ID/GITHUB_CLIENT_SECRET not set. GitHub login is disabled; /login and /github/callback will return 503.'
    );
}

passport.serializeUser((user, done) => {
    done(null, {
        id: user.id,
        username: user.username || user.login,
        displayName:
            user.displayName ||
            (user._json && user._json.name) ||
            user.username ||
            user.login,
        avatar:
            (user.photos && user.photos[0] && user.photos[0].value) ||
            (user._json && user._json.avatar_url)
    });
});

passport.deserializeUser((obj, done) => done(null, obj));

passport.isGitHubConfigured = () => githubConfigured;

passport.callbackURLFor = resolveCallbackURL;

module.exports = passport;
