const express = require('express');
const router = express.Router();
const twoFactorController = require('../controllers/twoFactorController');
const authenticate = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// All routes require authentication
router.use(authenticate);

// Get 2FA status
router.get('/status', twoFactorController.get2FAStatus);

// Setup 2FA (generate secret and QR code)
router.post('/setup', twoFactorController.setup2FA);

// Verify 2FA token and enable it
router.post('/verify', authLimiter, twoFactorController.verify2FA);

// Disable 2FA
router.post('/disable', authLimiter, twoFactorController.disable2FA);

module.exports = router;
