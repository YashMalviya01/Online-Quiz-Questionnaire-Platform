const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');
const enhancedProctoringController = require('../controllers/enhancedProctoringController');

// Create proctoring event
router.post(
  '/events',
  auth,
  [
    body('quizId').notEmpty().withMessage('Quiz ID is required'),
    body('resultId').notEmpty().withMessage('Result ID is required')
  ],
  enhancedProctoringController.createProctoringEvent
);

// Update proctoring event (add violations)
router.put(
  '/events/:id',
  auth,
  enhancedProctoringController.updateProctoringEvent
);

// Get proctoring event by ID
router.get(
  '/events/:id',
  auth,
  enhancedProctoringController.getProctoringEvent
);

// Get proctoring events for a quiz
router.get(
  '/quiz/:quizId/events',
  auth,
  authorizeRole(['instructor', 'admin']),
  enhancedProctoringController.getQuizProctoringEvents
);

// Review proctoring event
router.post(
  '/events/:id/review',
  auth,
  authorizeRole(['instructor', 'admin']),
  [
    body('reviewStatus').isIn(['pending', 'under-review', 'cleared', 'flagged'])
      .withMessage('Invalid review status')
  ],
  enhancedProctoringController.reviewProctoringEvent
);

// Get flagged attempts
router.get(
  '/quiz/:quizId/flagged',
  auth,
  authorizeRole(['instructor', 'admin']),
  enhancedProctoringController.getFlaggedAttempts
);

module.exports = router;
