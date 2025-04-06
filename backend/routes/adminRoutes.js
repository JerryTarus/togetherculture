
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

router.use(authMiddleware);
router.use(authorize('admin'));

router.put('/approve-user/:id', adminController.approveUser);
router.put('/unapprove-user/:id', adminController.unapproveUser);
router.delete('/delete-user/:id', adminController.deleteUser);
router.put('/update-user-role/:id', adminController.updateUserRole);
router.get('/pending-users', adminController.getPendingUsers);
router.get('/users', adminController.getAllUsers);
router.post('/create-module', adminController.createModule);
router.get('/modules', adminController.getAllModules);
router.get('/module-enrollments', adminController.getModuleEnrollments);


module.exports = router;
