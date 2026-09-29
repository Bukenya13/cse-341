const router = require('express').Router();
const contactsController = require('../frontend/controllers/contacts');
const requireAuth = require('../middleware/isAuthenticated');

router.get('/', contactsController.getAll);
router.get('/:id', contactsController.getSingle);
router.post('/', requireAuth, contactsController.createContact);
router.put('/:id', requireAuth, contactsController.updateContact);
router.delete('/:id', requireAuth, contactsController.deleteContact);

module.exports = router;
