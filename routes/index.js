const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({
        name: 'CSE 341 Project 2 API',
        description: 'REST API with CRUD operations for the contacts and users collections.',
        collections: [
            { name: 'contacts', endpoints: ['GET /contacts', 'GET /contacts/:id', 'POST /contacts', 'PUT /contacts/:id', 'DELETE /contacts/:id'] },
            { name: 'users', endpoints: ['GET /users', 'GET /users/:id', 'POST /users', 'PUT /users/:id', 'DELETE /users/:id'] }
        ]
    });
});

router.use('/contacts', require('./contacts'));
router.use('/users', require('./users'));
router.use('/', require('./pages'));

module.exports = router;
