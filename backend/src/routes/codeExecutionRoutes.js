const express = require('express');
const codeExecutionService = require('../services/codeExecutionService');
const authenticate = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const { logAudit } = require('../services/auditService');

const router = express.Router();

/**
 * Execute code
 */
router.post(
  '/execute',
  authenticate,
  [
    body('code').notEmpty().withMessage('Code is required'),
    body('language').notEmpty().withMessage('Language is required'),
    body('input').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { code, language, input } = req.body;
      const useDocker = process.env.USE_DOCKER === 'true';

      const result = useDocker
        ? await codeExecutionService.executeCodeDocker(code, language, input)
        : await codeExecutionService.executeCode(code, language, input);

      // Log execution
      await logAudit({
        userId: req.user.id,
        action: 'EXECUTE_CODE',
        resource: 'Code',
        details: {
          language,
          success: result.success,
          executionTime: result.executionTime
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      res.json(result);
    } catch (error) {
      console.error('Code execution error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to execute code',
        message: error.message
      });
    }
  }
);

/**
 * Test code with test cases
 */
router.post(
  '/test',
  authenticate,
  [
    body('code').notEmpty().withMessage('Code is required'),
    body('language').notEmpty().withMessage('Language is required'),
    body('testCases').isArray().withMessage('Test cases must be an array'),
    body('testCases.*.input').isString(),
    body('testCases.*.expectedOutput').isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { code, language, testCases } = req.body;

      const result = await codeExecutionService.testCode(code, language, testCases);

      // Log test execution
      await logAudit({
        userId: req.user.id,
        action: 'TEST_CODE',
        resource: 'Code',
        details: {
          language,
          totalTests: result.totalTests,
          passedTests: result.passedTests,
          executionTime: result.totalExecutionTime
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      res.json(result);
    } catch (error) {
      console.error('Code testing error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to test code',
        message: error.message
      });
    }
  }
);

/**
 * Get supported languages
 */
router.get('/languages', (req, res) => {
  const languages = [
    { value: 'javascript', label: 'JavaScript', version: 'Node.js 18' },
    { value: 'python', label: 'Python', version: '3.11' },
    { value: 'java', label: 'Java', version: '17' },
    { value: 'cpp', label: 'C++', version: 'GCC 12' },
    { value: 'c', label: 'C', version: 'GCC 12' },
    { value: 'csharp', label: 'C#', version: 'Mono' },
    { value: 'go', label: 'Go', version: '1.21' },
    { value: 'rust', label: 'Rust', version: '1.75' },
    { value: 'php', label: 'PHP', version: '8.2' },
    { value: 'ruby', label: 'Ruby', version: '3.2' }
  ];

  res.json(languages);
});

module.exports = router;
