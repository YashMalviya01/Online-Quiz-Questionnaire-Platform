const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const oauthController = require('../controllers/oauthController');
const twoFactorController = require('../controllers/twoFactorController');
const passwordController = require('../controllers/passwordController');
const authenticate = require('../middleware/auth');
const passport = require('../config/passport');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['student', 'instructor', 'admin'])
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  authController.login
);

router.post('/enroll-face', authenticate, authController.enrollFace);
router.post('/verify-face', authenticate, authController.verifyFace);
router.get('/me', authenticate, authController.me);

// 2FA routes
router.post('/2fa/verify-login', authLimiter, twoFactorController.verify2FALogin);
router.get('/2fa/status', authenticate, twoFactorController.get2FAStatus);

// Password management routes
router.post('/forgot-password', authLimiter, passwordController.forgotPassword);
router.post('/reset-password', authLimiter, passwordController.resetPassword);
router.post('/change-password', authenticate, passwordController.changePassword);

// Email verification routes
router.post('/send-verification', authenticate, passwordController.sendEmailVerification);
router.post('/verify-email', passwordController.verifyEmail);

// OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  oauthController.googleCallback
);

router.get('/microsoft', passport.authenticate('microsoft', { scope: ['user.read'] }));
router.get(
  '/microsoft/callback',
  passport.authenticate('microsoft', { session: false, failureRedirect: '/login' }),
  oauthController.microsoftCallback
);

module.exports = router;
