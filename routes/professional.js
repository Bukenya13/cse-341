const router = require('express').Router();
const professionalController = require('../controllers/professional');

router.get('/', professionalController.getData);

module.exports = router;
