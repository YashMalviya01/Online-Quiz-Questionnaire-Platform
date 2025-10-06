const rateLimit = require('express-rate-limit');

// General API rate limiter
// TEMPORARILY DISABLED FOR TESTING
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Limit each IP to 10000 requests per windowMs (effectively disabled)
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'You have exceeded the rate limit. Please try again later.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// Strict rate limiter for authentication endpoints
// TEMPORARILY DISABLED - Set to very high limit for testing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Limit each IP to 10000 requests per windowMs (effectively disabled)
  skipSuccessfulRequests: false,
  message: {
    error: 'Too many login attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many login attempts',
      message: 'Your account has been temporarily locked due to too many failed login attempts. Please try again in 15 minutes.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// Code execution rate limiter (more restrictive)
// TEMPORARILY DISABLED FOR TESTING
const codeExecutionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10000, // Limit each IP to 10000 code executions per minute (effectively disabled)
  message: {
    error: 'Too many code execution requests',
    retryAfter: '1 minute'
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'You have exceeded the code execution rate limit. Please wait before trying again.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// File upload rate limiter
// TEMPORARILY DISABLED FOR TESTING
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10000, // Limit each IP to 10000 uploads per hour (effectively disabled)
  message: {
    error: 'Too many upload requests',
    retryAfter: '1 hour'
  }
});

// Admin endpoints rate limiter (more lenient)
// TEMPORARILY DISABLED FOR TESTING
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Limit each IP to 10000 requests per windowMs (effectively disabled)
  message: {
    error: 'Too many admin requests',
    retryAfter: '15 minutes'
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  codeExecutionLimiter,
  uploadLimiter,
  adminLimiter
};
