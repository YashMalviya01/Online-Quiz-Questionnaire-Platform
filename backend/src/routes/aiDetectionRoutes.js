const express = require('express');
const aiDetectionService = require('../services/aiDetectionService');
const authenticate = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');
const { body, validationResult } = require('express-validator');
const { logAudit } = require('../services/auditService');

const router = express.Router();

/**
 * Analyze code for plagiarism and AI generation
 */
router.post(
  '/analyze',
  authenticate,
  authorizeRole('admin'),
  [
    body('code').notEmpty().withMessage('Code is required'),
    body('previousSubmissions').optional().isArray()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { code, previousSubmissions } = req.body;

      const analysis = await aiDetectionService.analyzeCode(code, previousSubmissions || []);

      // Log analysis
      await logAudit({
        userId: req.user.id,
        action: 'ANALYZE_CODE',
        resource: 'AI Detection',
        details: {
          flagged: analysis.flagged,
          overallRisk: analysis.overallRisk
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      res.json(analysis);
    } catch (error) {
      console.error('Code analysis error:', error);
      res.status(500).json({
        error: 'Failed to analyze code',
        message: error.message
      });
    }
  }
);

/**
 * Check for plagiarism only
 */
router.post(
  '/plagiarism',
  authenticate,
  authorizeRole('admin'),
  [
    body('code').notEmpty().withMessage('Code is required'),
    body('previousSubmissions').optional().isArray()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { code, previousSubmissions } = req.body;

      const result = await aiDetectionService.detectPlagiarism(code, previousSubmissions || []);

      await logAudit({
        userId: req.user.id,
        action: 'CHECK_PLAGIARISM',
        resource: 'AI Detection',
        details: {
          isPlagiarized: result.isPlagiarized,
          confidence: result.confidence
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      res.json(result);
    } catch (error) {
      console.error('Plagiarism detection error:', error);
      res.status(500).json({
        error: 'Failed to check plagiarism',
        message: error.message
      });
    }
  }
);

/**
 * Check for AI-generated code
 */
router.post(
  '/ai-generated',
  authenticate,
  authorizeRole('admin'),
  [
    body('code').notEmpty().withMessage('Code is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { code } = req.body;

      const result = await aiDetectionService.detectAIGenerated(code);

      await logAudit({
        userId: req.user.id,
        action: 'CHECK_AI_GENERATED',
        resource: 'AI Detection',
        details: {
          isAIGenerated: result.isAIGenerated,
          confidence: result.confidence
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      res.json(result);
    } catch (error) {
      console.error('AI detection error:', error);
      res.status(500).json({
        error: 'Failed to check for AI-generated code',
        message: error.message
      });
    }
  }
);

module.exports = router;
