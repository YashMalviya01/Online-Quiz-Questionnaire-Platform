const { validationResult } = require('express-validator');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

const questionProjection =
  [
    'questionText',
    'questionType',
    'options',
    'correctAnswer',
    'codeLanguage',
    'starterCode',
    'evaluationNotes',
    'referenceSolution',
    'maxScore',
    'blankAnswers',
    'caseSensitive',
    'matchingPairs',
    'wordLimit',
    'rubric',
    'sampleAnswer',
    'allowedFileTypes',
    'maxFileSize',
    'partialCredit'
  ].join(' ');

const withQuestions = (query) =>
  query.populate({ path: 'questions', select: questionProjection }).populate({ path: 'createdBy', select: 'username email' });

const prepareQuestionPayload = (question) => {
  const type = question.questionType || 'multiple-choice';
  const maxScore = resolveNumber(question.maxScore, 1);
  const base = {
    questionText: question.questionText?.trim() || '',
    questionType: type,
    maxScore,
    evaluationNotes: question.evaluationNotes || '',
    referenceSolution: question.referenceSolution || ''
  };

  switch (type) {
    case 'code':
      return {
        ...base,
        codeLanguage: question.codeLanguage || 'javascript',
        starterCode: question.starterCode || '',
        correctAnswer: question.correctAnswer || '',
        partialCredit: false,
        options: []
      };

    case 'true-false': {
      const normalizedAnswer = (question.correctAnswer === 'False' || question.correctAnswer === false)
        ? 'False'
        : 'True';
      return {
        ...base,
        options: ['True', 'False'],
        correctAnswer: normalizedAnswer,
        partialCredit: false
      };
    }

    case 'fill-in-blank': {
      const blankAnswers = Array.isArray(question.blankAnswers)
        ? question.blankAnswers.map((answer) => `${answer}`.trim()).filter(Boolean)
        : [];
      return {
        ...base,
        blankAnswers,
        caseSensitive: Boolean(question.caseSensitive),
        partialCredit: Boolean(question.partialCredit),
        options: [],
        correctAnswer: ''
      };
    }

    case 'matching': {
      const matchingPairs = Array.isArray(question.matchingPairs)
        ? question.matchingPairs
            .map((pair) => ({
              left: pair?.left?.toString().trim() || '',
              right: pair?.right?.toString().trim() || ''
            }))
            .filter((pair) => pair.left && pair.right)
        : [];
      return {
        ...base,
        matchingPairs,
        partialCredit:
          question.partialCredit !== undefined ? Boolean(question.partialCredit) : true,
        options: [],
        correctAnswer: ''
      };
    }

    case 'essay':
      return {
        ...base,
        wordLimit: resolveNumber(question.wordLimit, undefined),
        rubric: question.rubric || '',
        sampleAnswer: question.sampleAnswer || '',
        partialCredit: false,
        options: [],
        correctAnswer: ''
      };

    case 'file-upload': {
      const allowedFileTypes = Array.isArray(question.allowedFileTypes)
        ? question.allowedFileTypes
            .map((type) => type?.toString().trim().replace(/^[.]/, '').toLowerCase())
            .filter(Boolean)
        : [];
      return {
        ...base,
        allowedFileTypes,
        maxFileSize: resolveNumber(question.maxFileSize, 5),
        partialCredit: false,
        options: [],
        correctAnswer: ''
      };
    }

    case 'multiple-choice':
    default: {
      const options = Array.isArray(question.options)
        ? question.options.map((option) => `${option}`.trim()).filter(Boolean)
        : [];
      const safeAnswer = options.includes(question.correctAnswer)
        ? question.correctAnswer
        : options[0] || '';
      return {
        ...base,
        options,
        correctAnswer: `${safeAnswer || ''}`.trim(),
        partialCredit: false
      };
    }
  }
};

const resolveNumber = (value, fallback) => {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
};

exports.getQuizzes = async (req, res, next) => {
  try {
    // Students should only see published quizzes.
    // Instructors can view their own quizzes (even drafts) plus published quizzes.
    // Admins can view everything.
    let filter = { isPublished: true };

    if (req.user.role === 'admin') {
      filter = {};
    } else if (req.user.role === 'instructor') {
      filter = {
        $or: [
          { isPublished: true },
          { createdBy: req.user._id }
        ]
      };
    }

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

    if (req.user.role === 'instructor' && quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: you can only update quizzes you created' });
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

    if (req.user.role === 'instructor' && quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: you can only delete quizzes you created' });
    }

    await Question.deleteMany({ _id: { $in: quiz.questions } });
    await quiz.deleteOne();

    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    next(error);
  }
};
