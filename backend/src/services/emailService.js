const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send email
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Quiz Platform" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Send welcome email
 */
exports.sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to Quiz Platform!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Welcome to Quiz Platform!</h1>
      <p>Hi ${user.username},</p>
      <p>Thank you for registering with Quiz Platform. We're excited to have you on board!</p>
      <p>You can now:</p>
      <ul>
        <li>Take proctored exams</li>
        <li>View your results and progress</li>
        <li>Enable two-factor authentication for extra security</li>
      </ul>
      <p>Get started by logging in at: <a href="${process.env.FRONTEND_URL}/login">Login</a></p>
      <p>Best regards,<br>Quiz Platform Team</p>
    </div>
  `;
  const text = `Welcome to Quiz Platform! Thank you for registering, ${user.username}.`;

  return sendEmail({ to: user.email, subject, html, text });
};

/**
 * Send email verification
 */
exports.sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const subject = 'Verify Your Email Address';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Verify Your Email</h1>
      <p>Hi ${user.username},</p>
      <p>Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" 
           style="background-color: #2563eb; color: white; padding: 12px 30px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email
        </a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="color: #64748b; word-break: break-all;">${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
      <p>Best regards,<br>Quiz Platform Team</p>
    </div>
  `;
  const text = `Verify your email by clicking this link: ${verificationUrl}`;

  return sendEmail({ to: user.email, subject, html, text });
};

/**
 * Send password reset email
 */
exports.sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const subject = 'Reset Your Password';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Reset Your Password</h1>
      <p>Hi ${user.username},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #2563eb; color: white; padding: 12px 30px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="color: #64748b; word-break: break-all;">${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
      <p>Best regards,<br>Quiz Platform Team</p>
    </div>
  `;
  const text = `Reset your password by clicking this link: ${resetUrl}. This link expires in 1 hour.`;

  return sendEmail({ to: user.email, subject, html, text });
};

/**
 * Send 2FA enabled notification
 */
exports.send2FAEnabledEmail = async (user) => {
  const subject = 'Two-Factor Authentication Enabled';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #10b981;">2FA Enabled Successfully</h1>
      <p>Hi ${user.username},</p>
      <p>Two-factor authentication has been successfully enabled on your account.</p>
      <p>From now on, you'll need to enter a code from your authenticator app when logging in.</p>
      <p><strong>Keep your backup codes safe!</strong> You'll need them if you lose access to your authenticator app.</p>
      <p>If you didn't enable 2FA, please contact support immediately.</p>
      <p>Best regards,<br>Quiz Platform Team</p>
    </div>
  `;
  const text = `Two-factor authentication has been enabled on your account.`;

  return sendEmail({ to: user.email, subject, html, text });
};

/**
 * Send suspicious activity alert
 */
exports.sendSecurityAlertEmail = async (user, activity) => {
  const subject = 'Security Alert: Suspicious Activity Detected';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #ef4444;">Security Alert</h1>
      <p>Hi ${user.username},</p>
      <p>We detected suspicious activity on your account:</p>
      <div style="background-color: #fee; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
        <p style="margin: 0;"><strong>Activity:</strong> ${activity.type}</p>
        <p style="margin: 5px 0;"><strong>Time:</strong> ${activity.timestamp}</p>
        <p style="margin: 5px 0;"><strong>Location:</strong> ${activity.location || 'Unknown'}</p>
        <p style="margin: 5px 0;"><strong>IP Address:</strong> ${activity.ip || 'Unknown'}</p>
      </div>
      <p>If this was you, you can safely ignore this email.</p>
      <p>If this wasn't you, please:</p>
      <ol>
        <li>Change your password immediately</li>
        <li>Enable two-factor authentication</li>
        <li>Contact support</li>
      </ol>
      <p>Best regards,<br>Quiz Platform Team</p>
    </div>
  `;
  const text = `Security alert: Suspicious activity detected on your account. Activity: ${activity.type}`;

  return sendEmail({ to: user.email, subject, html, text });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail: exports.sendWelcomeEmail,
  sendVerificationEmail: exports.sendVerificationEmail,
  sendPasswordResetEmail: exports.sendPasswordResetEmail,
  send2FAEnabledEmail: exports.send2FAEnabledEmail,
  sendSecurityAlertEmail: exports.sendSecurityAlertEmail,
};
