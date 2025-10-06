const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');
const gradingController = require('../controllers/gradingController');

// Get pending grading for a quiz
router.get(
  '/quiz/:quizId/pending',
  auth,
  authorizeRole(['instructor', 'admin']),
  gradingController.getPendingGrading
);

// Grade a single answer
router.post(
  '/result/:resultId/answer/:questionId',
  auth,
  authorizeRole(['instructor', 'admin']),
  [
    body('awardedScore').isNumeric().withMessage('Awarded score must be a number')
  ],
  gradingController.gradeAnswer
);

// Grade with rubric
router.post(
  '/result/:resultId/answer/:questionId/rubric',
  auth,
  authorizeRole(['instructor', 'admin']),
  [
    body('rubricScores').isObject().withMessage('Rubric scores must be an object')
  ],
  gradingController.gradeWithRubric
);

// Bulk grade multiple answers
router.post(
  '/result/:resultId/bulk',
  auth,
  authorizeRole(['instructor', 'admin']),
  [
    body('gradings').isArray().withMessage('Gradings must be an array')
  ],
  gradingController.bulkGrade
);

// Add instructor feedback
router.post(
  '/result/:resultId/feedback',
  auth,
  authorizeRole(['instructor', 'admin']),
  [
    body('feedback').notEmpty().withMessage('Feedback is required')
  ],
  gradingController.addFeedback
);

// Get grading statistics
router.get(
  '/quiz/:quizId/statistics',
  auth,
  authorizeRole(['instructor', 'admin']),
  gradingController.getGradingStatistics
);

// Auto-grade objective questions
router.post(
  '/result/:resultId/auto-grade',
  auth,
  authorizeRole(['instructor', 'admin']),
  gradingController.autoGrade
);

module.exports = router;
