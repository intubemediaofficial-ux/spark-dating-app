const express = require('express');
const router = express.Router();
const { getUsers, toggleBanUser, approveProfile, getReports, resolveReport, getDashboardStats } = require('../controllers/adminController');
const { authenticate, adminOnly } = require('../middleware/auth');

router.use(authenticate, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:userId/ban', toggleBanUser);
router.put('/users/:userId/approve', approveProfile);
router.get('/reports', getReports);
router.put('/reports/:reportId/resolve', resolveReport);

module.exports = router;
