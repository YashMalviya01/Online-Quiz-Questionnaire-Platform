const { validationResult } = require('express-validator');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

const questionProjection =
  'questionText questionType options correctAnswer codeLanguage starterCode evaluationNotes referenceSolution maxScore';

const withQuestions = (query) =>
  query.populate({ path: 'questions', select: questionProjection }).populate({ path: 'createdBy', select: 'username email' });

const prepareQuestionPayload = (question) => {
  const type = question.questionType === 'code' ? 'code' : 'multiple-choice';
  const parsedMaxScore = Number.parseFloat(question.maxScore);
  const maxScore = Number.isFinite(parsedMaxScore) && parsedMaxScore > 0 ? parsedMaxScore : 1;
  const base = {
    questionText: question.questionText?.trim() || '',
    questionType: type,
    maxScore,
    evaluationNotes: question.evaluationNotes || '',
    referenceSolution: question.referenceSolution || ''
  };

  if (type === 'code') {
    return {
      ...base,
      codeLanguage: question.codeLanguage || 'javascript',
      starterCode: question.starterCode || '',
      correctAnswer: question.correctAnswer || ''
    };
  }

  return {
    ...base,
    options: (question.options || []).map((option) => `${option}`.trim()).filter(Boolean),
    correctAnswer: `${question.correctAnswer || ''}`.trim()
  };
};

exports.getQuizzes = async (req, res, next) => {
  try {
    // Students should only see published quizzes, admins see all
    const filter = req.user.role === 'admin' ? {} : { isPublished: true };
    const quizzes = await withQuestions(Quiz.find(filter));
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};

exports.getQuizById = async (req, res, next) => {
  try {
    const quiz = await withQuestions(Quiz.findById(req.params.id));
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

exports.createQuiz = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, questions, isPublished } = req.body;

  try {
    const preparedQuestions = questions.map(prepareQuestionPayload);
    const createdQuestions = await Question.insertMany(preparedQuestions);
    const quiz = await Quiz.create({
      title,
      description,
      questions: createdQuestions.map((q) => q._id),
      createdBy: req.user._id,
      isPublished: isPublished !== undefined ? isPublished : true
    });

    const populated = await withQuestions(Quiz.findById(quiz._id));
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

exports.updateQuiz = async (req, res, next) => {
  const { title, description, questions, isPublished } = req.body;

  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (title) quiz.title = title;
    if (description !== undefined) quiz.description = description;
    if (isPublished !== undefined) quiz.isPublished = isPublished;

    if (Array.isArray(questions)) {
      await Question.deleteMany({ _id: { $in: quiz.questions } });
      const preparedQuestions = questions.map(prepareQuestionPayload);
      const createdQuestions = await Question.insertMany(preparedQuestions);
      quiz.questions = createdQuestions.map((q) => q._id);
    }

    await quiz.save();
    const populated = await withQuestions(Quiz.findById(quiz._id));
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

exports.deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    await Question.deleteMany({ _id: { $in: quiz.questions } });
    await quiz.deleteOne();

    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    next(error);
  }
};
