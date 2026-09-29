const router = require('express').Router();

const loginStatus = (req, res) => {
    const user = req.user || req.session?.user;
    res.status(200).send(user ? `Logged in as ${user.displayName || user.username}` : 'Logged Out');
};

router.get('/', loginStatus);

router.get('/whoami', loginStatus);

router.get('/api', (req, res) => {
    res.json({
        name: 'CSE 341 Project 2 API',
        description: 'REST API with CRUD operations for the contacts, users, colleges, courses, and instructors collections. Users can log in and log out using GitHub OAuth.',
        collections: [
            { name: 'contacts', endpoints: ['GET /contacts', 'GET /contacts/:id', 'POST /contacts', 'PUT /contacts/:id', 'DELETE /contacts/:id'] },
            { name: 'users', endpoints: ['GET /users', 'GET /users/:id', 'POST /users', 'PUT /users/:id', 'DELETE /users/:id'] },
            { name: 'colleges', endpoints: ['GET /colleges', 'GET /colleges/:id', 'POST /colleges', 'PUT /colleges/:id', 'DELETE /colleges/:id'] },
            { name: 'courses', endpoints: ['GET /courses', 'GET /courses/:id', 'POST /courses', 'PUT /courses/:id', 'DELETE /courses/:id'] },
            { name: 'instructors', endpoints: ['GET /instructors', 'GET /instructors/:id', 'POST /instructors', 'PUT /instructors/:id', 'DELETE /instructors/:id'] }
        ],
        oauth: [
            { name: 'login', endpoint: 'GET /login' },
            { name: 'callback', endpoint: 'GET /github/callback' },
            { name: 'logout', endpoint: 'GET /logout' }
        ]
    });
});

router.use('/contacts', require('./contacts'));
router.use('/users', require('./users'));
router.use('/colleges', require('./colleges'));
router.use('/courses', require('./courses'));
router.use('/instructors', require('./instructors'));
router.use('/', require('./auth'));
router.use('/', require('./pages'));

module.exports = router;
