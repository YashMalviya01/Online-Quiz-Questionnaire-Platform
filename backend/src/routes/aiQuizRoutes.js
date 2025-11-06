const express = require('express');
const aiQuizController = require('../controllers/aiQuizController');
const questionGeneratorController = require('../controllers/questionGeneratorController');
const authenticate = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');
const { body, param } = require('express-validator');

const router = express.Router();

/**
 * Question Generation Routes - Using Ollama AI (qwen2.5-coder:7b on Mac Mini M4)
 * All routes require authentication and instructor/admin role
 */

// Check AI availability (accessible to all authenticated users)
router.get(
  '/check-availability',
  authenticate,
  aiQuizController.checkAIAvailability
);

// Get available topics for a language (still using question bank for topic suggestions)
router.get(
  '/topics',
  authenticate,
  questionGeneratorController.getAvailableTopics
);

// Generate multiple choice questions using Ollama AI
router.post(
  '/generate/multiple-choice',
  authenticate,
  authorizeRole('instructor', 'admin'),
  [
    body('topic').optional().isString(),
    body('customPrompt').optional().isString(),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
    body('count').optional().isInt({ min: 1, max: 20 }),
    body('saveToBank').optional().isBoolean(),
    body('category').optional().isString(),
    body('language').optional().isString()
  ],
  aiQuizController.generateMultipleChoice
);

// Generate true/false questions using Ollama AI
router.post(
  '/generate/true-false',
  authenticate,
  authorizeRole('instructor', 'admin'),
  [
    body('topic').optional().isString(),
    body('customPrompt').optional().isString(),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
    body('count').optional().isInt({ min: 1, max: 20 }),
    body('saveToBank').optional().isBoolean(),
    body('category').optional().isString(),
    body('language').optional().isString()
  ],
  aiQuizController.generateTrueFalse
);

// Generate fill-in-the-blank questions using Ollama AI
router.post(
  '/generate/fill-in-the-blank',
  authenticate,
  authorizeRole('instructor', 'admin'),
  [
    body('topic').optional().isString(),
    body('customPrompt').optional().isString(),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
    body('count').optional().isInt({ min: 1, max: 20 }),
    body('saveToBank').optional().isBoolean(),
    body('category').optional().isString(),
    body('language').optional().isString()
  ],
  aiQuizController.generateFillInBlank
);

// Generate coding questions using Ollama AI
router.post(
  '/generate/coding',
  authenticate,
  authorizeRole('instructor', 'admin'),
  [
    body('topic').optional().isString(),
    body('customPrompt').optional().isString(),
    body('language').optional().isString(),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
    body('count').optional().isInt({ min: 1, max: 10 }),
    body('saveToBank').optional().isBoolean(),
    body('category').optional().isString()
  ],
  aiQuizController.generateCoding
);

// Generate mixed question types using Ollama AI
router.post(
  '/generate/mixed',
  authenticate,
  authorizeRole('instructor', 'admin'),
  [
    body('topic').optional().isString(),
    body('customPrompt').optional().isString(),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
    body('count').optional().isInt({ min: 1, max: 50 }),
    body('saveToBank').optional().isBoolean(),
    body('category').optional().isString(),
    body('language').optional().isString()
  ],
  aiQuizController.generateMixed
);

module.exports = router;
