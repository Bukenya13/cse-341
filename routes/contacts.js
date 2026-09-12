const router = require('express').Router();
const contactsController = require('../frontend/controllers/contacts');

router.get('/', contactsController.getAll);
router.get('/:id', contactsController.getSingle);

module.exports = router;
