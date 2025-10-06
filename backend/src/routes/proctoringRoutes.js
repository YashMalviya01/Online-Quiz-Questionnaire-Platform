const express = require('express');
const router = express.Router();
const proctoringController = require('../controllers/proctoringController');
const authenticate = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');

// Student routes - report violations during quiz
router.post('/violations/report', 
  authenticate, 
  proctoringController.reportViolation
);

// Student/Admin - get violations for specific attempt
router.get('/violations/attempt/:attemptId',
  authenticate,
  proctoringController.getAttemptViolations
);

// Admin routes - violation management
router.get('/violations/unreviewed',
  authenticate,
  authorizeRole('admin'),
  proctoringController.getUnreviewedViolations
);

router.get('/violations/student/:studentId',
  authenticate,
  authorizeRole('admin'),
  proctoringController.getStudentViolations
);

router.put('/violations/:violationId/review',
  authenticate,
  authorizeRole('admin'),
  proctoringController.reviewViolation
);

router.post('/disqualify',
  authenticate,
  authorizeRole('admin'),
  proctoringController.disqualifyStudent
);

router.get('/violations/stats',
  authenticate,
  authorizeRole('admin'),
  proctoringController.getViolationStats
);

router.get('/violations/live',
  authenticate,
  authorizeRole('admin'),
  proctoringController.getLiveViolations
);

module.exports = router;
