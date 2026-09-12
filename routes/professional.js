const router = require('express').Router();
const professionalController = require('../frontend/controllers/professional');

router.get('/', professionalController.getData);

module.exports = router;
