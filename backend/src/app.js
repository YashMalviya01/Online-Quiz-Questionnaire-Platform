const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const quizRoutes = require('./routes/quizRoutes');
const resultRoutes = require('./routes/resultRoutes');
const twoFactorRoutes = require('./routes/twoFactorRoutes');
const codeExecutionRoutes = require('./routes/codeExecutionRoutes');
const aiDetectionRoutes = require('./routes/aiDetectionRoutes');
const aiQuizRoutes = require('./routes/aiQuizRoutes');
const proctoringRoutes = require('./routes/proctoringRoutes');
const seedRoutes = require('./routes/seedRoutes');
const questionBankRoutes = require('./routes/questionBankRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const enhancedProctoringRoutes = require('./routes/enhancedProctoringRoutes');
const gradingRoutes = require('./routes/gradingRoutes');
const errorHandler = require('./middleware/errorHandler');
const { requestLogger, errorLogger } = require('./utils/advancedLogger');
const { apiLimiter, authLimiter, adminLimiter } = require('./middleware/rateLimiter');

const app = express();

const parseOrigins = (value = '') =>
  value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const fallbackOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];

const allowedOrigins = parseOrigins(process.env.CLIENT_ORIGIN);
if (process.env.CORS_DOMAIN) {
  allowedOrigins.push(process.env.CORS_DOMAIN);
}
const effectiveOrigins = allowedOrigins.length > 0 ? allowedOrigins : fallbackOrigins;

const normalizeOrigin = (origin) => {
  try {
    const url = new URL(origin);
    const port = url.port || (url.protocol === 'https:' ? '443' : url.protocol === 'http:' ? '80' : '');
    const defaultPort = (url.protocol === 'https:' && port === '443') || (url.protocol === 'http:' && port === '80');
    return `${url.protocol}//${url.hostname}${defaultPort ? '' : `:${port}`}`;
  } catch (error) {
    return origin;
  }
};

const isLocalNetworkOrigin = (origin) => {
  try {
    const { hostname } = new URL(origin);
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.endsWith('.local') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.16.') ||
      hostname.startsWith('172.17.') ||
      hostname.startsWith('172.18.') ||
      hostname.startsWith('172.19.') ||
      hostname.startsWith('172.20.') ||
      hostname.startsWith('172.21.') ||
      hostname.startsWith('172.22.') ||
      hostname.startsWith('172.23.') ||
      hostname.startsWith('172.24.') ||
      hostname.startsWith('172.25.') ||
      hostname.startsWith('172.26.') ||
      hostname.startsWith('172.27.') ||
      hostname.startsWith('172.28.') ||
      hostname.startsWith('172.29.') ||
      hostname.startsWith('172.30.') ||
      hostname.startsWith('172.31.')
    );
  } catch (error) {
    return false;
  }
};

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || process.env.CORS_ALLOW_ALL === 'true') {
        return callback(null, true);
      }

      const normalizedOrigin = normalizeOrigin(origin);
      const hasExplicitMatch = effectiveOrigins.some((allowed) => normalizeOrigin(allowed) === normalizedOrigin);
      const wildcardEnabled = effectiveOrigins.includes('*');

      if (hasExplicitMatch || wildcardEnabled || isLocalNetworkOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Trust proxy for ngrok and reverse proxies
app.set('trust proxy', true);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Session middleware (for OAuth)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Request logging
app.use(requestLogger);

const healthHandler = (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};

// Health check endpoint (no rate limiting)
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// API routes with rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/2fa', apiLimiter, twoFactorRoutes);
app.use('/api/admin', adminLimiter, adminRoutes);
app.use('/api/quizzes', apiLimiter, quizRoutes);
app.use('/api/results', apiLimiter, resultRoutes);
app.use('/api/code', apiLimiter, codeExecutionRoutes);
app.use('/api/ai-detection', adminLimiter, aiDetectionRoutes);
app.use('/api/ai-quiz', apiLimiter, aiQuizRoutes);
app.use('/api/proctoring', apiLimiter, proctoringRoutes);
app.use('/api/question-banks', apiLimiter, questionBankRoutes);
app.use('/api/analytics', apiLimiter, analyticsRoutes);
app.use('/api/enhanced-proctoring', apiLimiter, enhancedProctoringRoutes);
app.use('/api/grading', apiLimiter, gradingRoutes);
app.use('/api/seed', seedRoutes); // Demo data seeding (no auth for easy setup)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Error logger
app.use(errorLogger);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
