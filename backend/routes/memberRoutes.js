
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const memberController = require('../controllers/memberController');

router.use(authMiddleware);
router.use(authorize('member'));

router.get('/profile', memberController.getProfile);
router.put('/profile', memberController.updateProfile);

router.get('/dashboard', memberController.dashboard);
router.get('/modules', memberController.viewModules);
router.post('/book-module', memberController.bookModule);

module.exports = router;
