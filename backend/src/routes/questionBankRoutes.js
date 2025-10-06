const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');
const questionBankController = require('../controllers/questionBankController');

// Create question bank
router.post(
  '/',
  auth,
  authorizeRole(['instructor', 'admin']),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').optional(),
    body('category').optional(),
    body('subject').optional(),
    body('tags').optional().isArray(),
    body('isPublic').optional().isBoolean()
  ],
  questionBankController.createQuestionBank
);

// Get all question banks (with filters)
router.get(
  '/',
  auth,
  questionBankController.getQuestionBanks
);

// Get single question bank
router.get(
  '/:id',
  auth,
  questionBankController.getQuestionBankById
);

// Update question bank
router.put(
  '/:id',
  auth,
  authorizeRole(['instructor', 'admin']),
  questionBankController.updateQuestionBank
);

// Delete question bank
router.delete(
  '/:id',
  auth,
  authorizeRole(['instructor', 'admin']),
  questionBankController.deleteQuestionBank
);

// Add question to bank
router.post(
  '/:id/questions',
  auth,
  authorizeRole(['instructor', 'admin']),
  [
    body('questionId').notEmpty().withMessage('Question ID is required')
  ],
  questionBankController.addQuestionToBank
);

// Remove question from bank
router.delete(
  '/:id/questions/:questionId',
  auth,
  authorizeRole(['instructor', 'admin']),
  questionBankController.removeQuestionFromBank
);

// Share question bank
router.post(
  '/:id/share',
  auth,
  authorizeRole(['instructor', 'admin']),
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('permission').isIn(['view', 'edit']).withMessage('Permission must be view or edit')
  ],
  questionBankController.shareQuestionBank
);

// Unshare question bank
router.delete(
  '/:id/share/:userId',
  auth,
  authorizeRole(['instructor', 'admin']),
  questionBankController.unshareQuestionBank
);

// Get question bank statistics
router.get(
  '/:id/statistics',
  auth,
  questionBankController.getQuestionBankStatistics
);

module.exports = router;
