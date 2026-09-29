const express = require('express');
const router = express.Router();

const collegesController = require('../data/controllers/colleges');
const requireAuth = require('../middleware/isAuthenticated');

router.get('/', collegesController.getAll);

router.get('/:id', collegesController.getSingle);

router.post('/', requireAuth, collegesController.createCollege);

router.put('/:id', requireAuth, collegesController.updateCollege);

router.delete('/:id', requireAuth, collegesController.deleteCollege);

module.exports = router;
