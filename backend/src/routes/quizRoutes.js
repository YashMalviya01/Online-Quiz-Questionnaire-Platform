const express = require('express');
const { body } = require('express-validator');
const quizController = require('../controllers/quizController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/role');

const router = express.Router();

router.use(authenticate);

router.get('/', quizController.getQuizzes);
router.get('/:id', quizController.getQuizById);

router.post(
  '/',
  authorize('admin', 'instructor'),
  [
    body('title').notEmpty(),
    body('questions').isArray({ min: 1 }),
    body('questions.*.questionText').notEmpty(),
    body('questions.*.questionType').optional().isIn(['multiple-choice', 'code']),
    body('questions.*').custom((question) => {
      if (question.questionType === 'code') {
        if (!question.maxScore || Number(question.maxScore) <= 0) {
          throw new Error('Code questions must specify a positive maxScore.');
        }
        return true;
      }

      if (!Array.isArray(question.options) || question.options.length < 2) {
        throw new Error('Multiple-choice questions require at least two options.');
      }
      if (!question.correctAnswer) {
        throw new Error('Multiple-choice questions require a correct answer.');
      }
      if (!question.options.includes(question.correctAnswer)) {
        throw new Error('Correct answer must be one of the provided options.');
      }
      return true;
    })
  ],
  quizController.createQuiz
);

router.put('/:id', authorize('admin', 'instructor'), quizController.updateQuiz);
router.delete('/:id', authorize('admin', 'instructor'), quizController.deleteQuiz);

module.exports = router;
