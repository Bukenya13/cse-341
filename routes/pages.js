const path = require('node:path');
const router = require('express').Router();

router.get('/contacts-page', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'contacts.html'));
});

router.get('/users-page', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'users.html'));
});

router.get('/profile-page', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

module.exports = router;