const express = require('express');
const router = express.Router();

const instructorsController = require('../data/controllers/instructors');
const requireAuth = require('../middleware/isAuthenticated');

router.get('/', instructorsController.getAll);

router.get('/:id', instructorsController.getSingle);

router.post('/', requireAuth, instructorsController.createInstructor);

router.put('/:id', requireAuth, instructorsController.updateInstructor);

router.delete('/:id', requireAuth, instructorsController.deleteInstructor);

module.exports = router;
