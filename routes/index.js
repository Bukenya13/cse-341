const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({
        name: 'CSE 341 Project 2 API',
        description: 'REST API with CRUD operations for the contacts and users collections. Users can log in and log out using GitHub OAuth.',
        collections: [
            { name: 'contacts', endpoints: ['GET /contacts', 'GET /contacts/:id', 'POST /contacts', 'PUT /contacts/:id', 'DELETE /contacts/:id'] },
            { name: 'users', endpoints: ['GET /users', 'GET /users/:id', 'POST /users', 'PUT /users/:id', 'DELETE /users/:id'] }
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
router.use('/', require('./auth'));
router.use('/', require('./pages'));

module.exports = router;
