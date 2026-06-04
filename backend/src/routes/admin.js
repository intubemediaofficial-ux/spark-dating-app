const express = require('express');
const router = express.Router();
const { getUsers, toggleBanUser, approveProfile, getReports, resolveReport, getDashboardStats, getBots, getSettings, updateSettings, getSubscriptions } = require('../controllers/adminController');
const { authenticate, adminOnly } = require('../middleware/auth');

// Settings endpoints - no auth for now (admin panel is internal)
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.get('/bots', getBots);
router.get('/subscriptions', getSubscriptions);

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:userId/ban', toggleBanUser);
router.put('/users/:userId/approve', approveProfile);
router.get('/reports', getReports);
router.put('/reports/:reportId/resolve', resolveReport);

module.exports = router;
