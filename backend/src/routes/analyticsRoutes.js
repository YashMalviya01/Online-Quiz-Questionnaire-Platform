const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');
const analyticsController = require('../controllers/analyticsController');

// Get quiz analytics
router.get(
  '/quiz/:quizId',
  auth,
  authorizeRole(['instructor', 'admin']),
  analyticsController.getQuizAnalytics
);

// Get question-level analytics
router.get(
  '/quiz/:quizId/questions',
  auth,
  authorizeRole(['instructor', 'admin']),
  analyticsController.getQuestionAnalytics
);

// Get at-risk students
router.get(
  '/quiz/:quizId/at-risk',
  auth,
  authorizeRole(['instructor', 'admin']),
  analyticsController.getAtRiskStudents
);

// Get top performers
router.get(
  '/quiz/:quizId/top-performers',
  auth,
  authorizeRole(['instructor', 'admin']),
  analyticsController.getTopPerformers
);

// Get performance trends
router.get(
  '/quiz/:quizId/trends',
  auth,
  authorizeRole(['instructor', 'admin']),
  analyticsController.getPerformanceTrends
);

// Get violation statistics
router.get(
  '/quiz/:quizId/violations',
  auth,
  authorizeRole(['instructor', 'admin']),
  analyticsController.getViolationStatistics
);

// Export analytics report
router.get(
  '/quiz/:quizId/export',
  auth,
  authorizeRole(['instructor', 'admin']),
  analyticsController.exportAnalyticsReport
);

// Recalculate analytics
router.post(
  '/quiz/:quizId/recalculate',
  auth,
  authorizeRole(['instructor', 'admin']),
  analyticsController.recalculateAnalytics
);

module.exports = router;
