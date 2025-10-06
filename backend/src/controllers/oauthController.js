const jwt = require('jsonwebtoken');
const { logAudit } = require('../services/auditService');

/**
 * Google OAuth callback
 */
exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
    }

    // Update last login
    user.lastLogin = new Date();
    user.lastLoginIP = req.ip;
    await user.save();

    // Log audit
    await logAudit({
      userId: user._id,
      action: 'LOGIN',
      resource: 'User',
      resourceId: user._id,
      metadata: { provider: 'google' },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};

/**
 * Microsoft OAuth callback
 */
exports.microsoftCallback = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
    }

    // Update last login
    user.lastLogin = new Date();
    user.lastLoginIP = req.ip;
    await user.save();

    // Log audit
    await logAudit({
      userId: user._id,
      action: 'LOGIN',
      resource: 'User',
      resourceId: user._id,
      metadata: { provider: 'microsoft' },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('Microsoft OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};
