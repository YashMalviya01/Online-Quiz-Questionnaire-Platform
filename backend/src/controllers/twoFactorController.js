const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');
const User = require('../models/User');
const { logAudit } = require('../services/auditService');

/**
 * Setup 2FA - Generate secret and QR code
 */
exports.setup2FA = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is already enabled' });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `QuizPlatform (${user.email})`,
      issuer: 'Online Quiz Platform',
      length: 32
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Temporarily store secret (not saved yet until verified)
    user.twoFactorSecret = secret.base32;
    await user.save();

    await logAudit({
      userId: user._id,
      action: 'SETUP_2FA',
      resource: 'User',
      resourceId: user._id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32
    });
  } catch (error) {
    console.error('Setup 2FA error:', error);
    res.status(500).json({ message: 'Failed to setup 2FA', error: error.message });
  }
};

/**
 * Verify 2FA token and enable 2FA
 */
exports.verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.user.id;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const user = await User.findById(userId);

    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: 'Please setup 2FA first' });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2 // Allow 2 time steps before/after for clock drift
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () =>
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );

    // Hash backup codes before storing
    const hashedBackupCodes = backupCodes.map(code =>
      crypto.createHash('sha256').update(code).digest('hex')
    );

    // Enable 2FA
    user.twoFactorEnabled = true;
    user.backupCodes = hashedBackupCodes;
    await user.save();

    await logAudit({
      userId: user._id,
      action: 'ENABLE_2FA',
      resource: 'User',
      resourceId: user._id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      message: '2FA enabled successfully',
      backupCodes: backupCodes // Return plain codes for user to save
    });
  } catch (error) {
    console.error('Verify 2FA error:', error);
    res.status(500).json({ message: 'Failed to verify 2FA', error: error.message });
  }
};

/**
 * Disable 2FA
 */
exports.disable2FA = async (req, res) => {
  try {
    const { password, token } = req.body;
    const userId = req.user.id;

    if (!password || !token) {
      return res.status(400).json({ message: 'Password and token are required' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Verify 2FA token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    user.backupCodes = [];
    await user.save();

    await logAudit({
      userId: user._id,
      action: 'DISABLE_2FA',
      resource: 'User',
      resourceId: user._id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    console.error('Disable 2FA error:', error);
    res.status(500).json({ message: 'Failed to disable 2FA', error: error.message });
  }
};

/**
 * Verify 2FA token during login
 */
exports.verify2FALogin = async (req, res) => {
  try {
    const { userId, token: userToken, isBackupCode } = req.body;

    if (!userId || !userToken) {
      return res.status(400).json({ message: 'User ID and token are required' });
    }

    const user = await User.findById(userId);

    if (!user || !user.twoFactorEnabled) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    let verified = false;

    if (isBackupCode) {
      // Verify backup code
      const hashedCode = crypto.createHash('sha256').update(userToken).digest('hex');
      const codeIndex = user.backupCodes.indexOf(hashedCode);

      if (codeIndex !== -1) {
        // Remove used backup code
        user.backupCodes.splice(codeIndex, 1);
        await user.save();
        verified = true;
      }
    } else {
      // Verify TOTP token
      verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: userToken,
        window: 2
      });
    }

    if (!verified) {
      await logAudit({
        userId: user._id,
        action: 'FAILED_2FA_LOGIN',
        resource: 'User',
        resourceId: user._id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      return res.status(400).json({ message: 'Invalid token' });
    }

    // Update last login
    user.lastLogin = new Date();
    user.lastLoginIP = req.ip;
    await user.save();

    await logAudit({
      userId: user._id,
      action: 'LOGIN',
      resource: 'User',
      resourceId: user._id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: '2FA verification successful',
      token: jwtToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Verify 2FA login error:', error);
    res.status(500).json({ message: 'Failed to verify 2FA', error: error.message });
  }
};

/**
 * Get 2FA status
 */
exports.get2FAStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('twoFactorEnabled backupCodes');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      enabled: user.twoFactorEnabled,
      backupCodesRemaining: user.backupCodes.length
    });
  } catch (error) {
    console.error('Get 2FA status error:', error);
    res.status(500).json({ message: 'Failed to get 2FA status', error: error.message });
  }
};
