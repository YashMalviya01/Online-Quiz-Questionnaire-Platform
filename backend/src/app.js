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

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:5174'];

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
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

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

// Health check endpoint (no rate limiting)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes with rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/2fa', apiLimiter, twoFactorRoutes);
app.use('/api/admin', adminLimiter, adminRoutes);
app.use('/api/quizzes', apiLimiter, quizRoutes);
app.use('/api/results', apiLimiter, resultRoutes);
app.use('/api/code', apiLimiter, codeExecutionRoutes);
app.use('/api/ai-detection', adminLimiter, aiDetectionRoutes);
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
