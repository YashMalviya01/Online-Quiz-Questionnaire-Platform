const express = require('express');
const { body } = require('express-validator');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/role');
const resultController = require('../controllers/resultController');

const router = express.Router();

router.use(authenticate);

router.post('/start', [body('quizId').isMongoId()], resultController.startExam);
router.post(
  '/:resultId/submit',
  [
    body('answers').isArray(),
    body('answers.*.questionId').isMongoId(),
    body('answers.*').custom((answer) => {
      if (!answer) {
        throw new Error('Answer payload is required.');
      }

      if (answer.selectedOption && typeof answer.selectedOption !== 'string') {
        throw new Error('Selected option must be a string.');
      }
      if (answer.textAnswer && typeof answer.textAnswer !== 'string') {
        throw new Error('Text answer must be a string.');
      }
      return true;
    })
  ],
  resultController.submitExam
);
router.get('/', authorize('admin', 'instructor'), resultController.getAllResults);
router.get('/user/:userId', resultController.getResultsForUser);
router.get('/:resultId', resultController.getResult);

module.exports = router;
