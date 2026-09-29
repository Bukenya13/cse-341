const express = require('express');
const router = express.Router();

const usersController = require('../data/controllers/users');
const requireAuth = require('../middleware/isAuthenticated');

router.get('/', usersController.getAll);

router.get('/:id', usersController.getSingle);

router.post('/', requireAuth, usersController.createUser);

router.put('/:id', requireAuth, usersController.updateUser);

router.delete('/:id', requireAuth, usersController.deleteUser);

module.exports = router;