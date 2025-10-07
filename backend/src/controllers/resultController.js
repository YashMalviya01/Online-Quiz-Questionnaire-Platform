const { validationResult } = require('express-validator');
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');

const populateResult = (query) =>
  query
    .populate({ path: 'quiz', populate: { path: 'questions' } })
    .populate({ path: 'user', select: 'username email role' })
    .populate({ path: 'proctoringLog', options: { sort: { timestamp: 1 } } });

exports.getAllResults = async (req, res, next) => {
  try {
    let query = Result.find().sort({ createdAt: -1 });

    if (req.user.role === 'instructor') {
      const quizIds = await Quiz.find({ createdBy: req.user._id }).distinct('_id');
      query = Result.find({ quiz: { $in: quizIds } }).sort({ createdAt: -1 });
    }

    const results = await populateResult(query);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

exports.startExam = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { quizId } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const existing = await Result.findOne({ quiz: quizId, user: req.user._id, status: 'in-progress' });
    if (existing) {
      return res.json(existing);
    }

    const result = await Result.create({ quiz: quizId, user: req.user._id });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

exports.submitExam = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { answers } = req.body;
  const { resultId } = req.params;

  try {
    const result = await Result.findById(resultId);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    if (result.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const quiz = await Quiz.findById(result.quiz).populate('questions');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const answerMap = new Map((answers || []).map((entry) => [entry.questionId?.toString(), entry]));
    let autoScore = 0;
    let autoMaxScore = 0;
    let requiresManualReview = false;

    const formattedAnswers = quiz.questions.map((question) => {
      const key = question._id.toString();
      const provided = answerMap.get(key) || {};
      const questionType = question.questionType || 'multiple-choice';
      const maxScore = Number.isFinite(question.maxScore) ? question.maxScore : 1;

      if (questionType === 'multiple-choice') {
        const selectedOption = provided.selectedOption || '';
        const isCorrect = selectedOption && selectedOption === question.correctAnswer;
        autoMaxScore += maxScore;
        if (isCorrect) {
          autoScore += maxScore;
        }
        return {
          questionId: question._id,
          questionType,
          selectedOption,
          textAnswer: '',
          awardedScore: isCorrect ? maxScore : 0
        };
      }

      const textAnswer = provided.textAnswer || '';
      requiresManualReview = true;
      autoMaxScore += maxScore;
      return {
        questionId: question._id,
        questionType,
        selectedOption: '',
        textAnswer,
        awardedScore: 0
      };
    });

    result.answers = formattedAnswers;
    result.autoScore = autoScore;
    result.autoMaxScore = autoMaxScore;
    result.requiresManualReview = requiresManualReview;
    result.score = autoMaxScore > 0 ? Math.round((autoScore / autoMaxScore) * 100) : 0;
    result.status = 'submitted';
    result.submittedAt = new Date();
    await result.save();

    const populated = await populateResult(Result.findById(result._id));
    res.json(await populated);
  } catch (error) {
    next(error);
  }
};

exports.getResult = async (req, res, next) => {
  try {
    const result = await populateResult(Result.findById(req.params.resultId));
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    if (
      req.user.role !== 'admin' &&
      result.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getResultsForUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const results = await populateResult(
      Result.find({ user: req.params.userId }).sort({ createdAt: -1 })
    );
    res.json(results);
  } catch (error) {
    next(error);
  }
};
