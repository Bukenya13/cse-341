const express = require('express');
const router = express.Router();

const coursesController = require('../data/controllers/courses');
const requireAuth = require('../middleware/isAuthenticated');

router.get('/', coursesController.getAll);

router.get('/:id', coursesController.getSingle);

router.post('/', requireAuth, coursesController.createCourse);

router.put('/:id', requireAuth, coursesController.updateCourse);

router.delete('/:id', requireAuth, coursesController.deleteCourse);

module.exports = router;
