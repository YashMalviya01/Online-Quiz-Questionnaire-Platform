const { validationResult } = require('express-validator');
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const questionValidator = require('../services/questionValidatorService');

const populateResult = (query) =>
  query
    .populate({ path: 'quiz', populate: { path: 'questions' } })
    .populate({ path: 'user', select: 'username email role' })
    .populate({
      path: 'answers.questionId',
      select: 'questionText questionType maxScore options correctAnswer rubric referenceSolution'
    })
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
    let totalMaxScore = 0;
    let pointsEarned = 0;
    let requiresManualReview = false;

  const formattedAnswers = [];
  const manualQuestionTypes = new Set(['code', 'essay', 'file-upload']);

    for (const question of quiz.questions) {
      const key = question._id.toString();
      const provided = answerMap.get(key) || {};
      const questionType = question.questionType || 'multiple-choice';
      const defaultMaxScore = Number.isFinite(question.maxScore) ? question.maxScore : 1;

      const baseAnswer = {
        questionId: question._id,
        questionType,
        selectedOption: '',
        codeAnswer: '',
        textAnswer: '',
        blankAnswers: [],
        matchingAnswers: [],
        essayAnswer: '',
        wordCount: 0,
        uploadedFiles: []
      };

      const validatorInput = {};

      switch (questionType) {
        case 'multiple-choice': {
          const raw =
            provided.selectedOption !== undefined
              ? provided.selectedOption
              : provided.answer !== undefined
                ? provided.answer
                : '';
          const selectedOption = typeof raw === 'boolean' ? (raw ? 'True' : 'False') : String(raw || '').trim();
          baseAnswer.selectedOption = selectedOption;
          baseAnswer.textAnswer = selectedOption;
          validatorInput.selectedOption = selectedOption;
          break;
        }

        case 'true-false': {
          const raw = provided.selectedOption ?? provided.answer ?? provided.textAnswer ?? '';
          const selectedOption = typeof raw === 'boolean' ? (raw ? 'True' : 'False') : String(raw || '').trim();
          baseAnswer.selectedOption = selectedOption;
          baseAnswer.textAnswer = selectedOption;
          validatorInput.selectedOption = raw;
          break;
        }

        case 'code': {
          const codeAnswer = typeof provided.codeAnswer === 'string'
            ? provided.codeAnswer
            : typeof provided.textAnswer === 'string'
              ? provided.textAnswer
              : '';
          baseAnswer.codeAnswer = codeAnswer;
          baseAnswer.textAnswer = codeAnswer;
          validatorInput.codeAnswer = codeAnswer;
          break;
        }

        case 'fill-in-blank': {
          const expectedLength = Array.isArray(question.blankAnswers) ? question.blankAnswers.length : 0;
          const blanks = Array.isArray(provided.blankAnswers)
            ? provided.blankAnswers.map((entry) => (entry ?? '').toString().trim())
            : [];
          if (expectedLength > 0) {
            while (blanks.length < expectedLength) blanks.push('');
            if (blanks.length > expectedLength) blanks.splice(expectedLength);
          }
          baseAnswer.blankAnswers = blanks;
          baseAnswer.textAnswer = blanks.filter(Boolean).join(' | ');
          validatorInput.blankAnswers = blanks;
          break;
        }

        case 'matching': {
          const providedMatches = Array.isArray(provided.matchingAnswers)
            ? provided.matchingAnswers.map((pair) => ({
                left: (pair?.left ?? '').toString().trim(),
                right: (pair?.right ?? '').toString().trim()
              }))
            : [];
          const matchMap = new Map(providedMatches.map((pair) => [pair.left, pair.right]));
          const normalizedMatches = Array.isArray(question.matchingPairs)
            ? question.matchingPairs.map((pair) => ({
                left: (pair?.left ?? '').toString(),
                right: matchMap.get((pair?.left ?? '').toString()) || ''
              }))
            : providedMatches;
          baseAnswer.matchingAnswers = normalizedMatches;
          baseAnswer.textAnswer = normalizedMatches
            .map((pair) => `${pair.left} → ${pair.right || '—'}`)
            .join('; ');
          validatorInput.matchingAnswers = normalizedMatches;
          break;
        }

        case 'essay': {
          const essayAnswer = typeof provided.essayAnswer === 'string'
            ? provided.essayAnswer
            : typeof provided.textAnswer === 'string'
              ? provided.textAnswer
              : '';
          const trimmedEssay = essayAnswer.trim();
          const wordCount = trimmedEssay ? trimmedEssay.split(/\s+/).filter(Boolean).length : 0;
          baseAnswer.essayAnswer = essayAnswer;
          baseAnswer.wordCount = wordCount;
          baseAnswer.textAnswer = essayAnswer;
          validatorInput.essayAnswer = essayAnswer;
          break;
        }

        case 'file-upload': {
          const uploadedFiles = Array.isArray(provided.uploadedFiles)
            ? provided.uploadedFiles.map((file) => ({
                filename: file.filename || file.name || 'uploaded-file',
                fileUrl: file.fileUrl || '',
                fileSize: (() => {
                  const rawSize = file?.fileSize ?? file?.size;
                  const numericSize = Number(rawSize);
                  return Number.isFinite(numericSize) ? numericSize : 0;
                })(),
                fileType: file.fileType || file.type || '',
                uploadedAt: file.uploadedAt ? new Date(file.uploadedAt) : new Date()
              }))
            : [];
          baseAnswer.uploadedFiles = uploadedFiles;
          baseAnswer.textAnswer = uploadedFiles.map((file) => file.filename).join(', ');
          validatorInput.uploadedFiles = uploadedFiles;
          break;
        }

        default: {
          const textAnswer = typeof provided.textAnswer === 'string'
            ? provided.textAnswer
            : typeof provided.answer === 'string'
              ? provided.answer
              : '';
          baseAnswer.textAnswer = textAnswer;
          break;
        }
      }

      let validation;
      try {
        validation = await questionValidator.validateAnswer(question, validatorInput);
      } catch (err) {
        validation = {
          isValid: false,
          needsGrading: true,
          awardedScore: 0,
          maxScore: defaultMaxScore
        };
      }

      let needsGrading = validation?.needsGrading === true;
      if (manualQuestionTypes.has(questionType)) {
        needsGrading = true;
      }
      const isValid = validation?.isValid !== false;
      const awardedScore = needsGrading || !isValid
        ? 0
        : Number.isFinite(validation?.awardedScore)
          ? validation.awardedScore
          : 0;
      const resolvedMaxScore = Number.isFinite(validation?.maxScore)
        ? validation.maxScore
        : defaultMaxScore;
      const isCorrect = !needsGrading && Boolean(validation?.isCorrect);

      if (!needsGrading) {
        autoScore += awardedScore;
        autoMaxScore += resolvedMaxScore;
      } else {
        requiresManualReview = true;
      }

      totalMaxScore += resolvedMaxScore;
      pointsEarned += awardedScore;

      formattedAnswers.push({
        ...baseAnswer,
        awardedScore,
        maxScore: resolvedMaxScore,
        isCorrect,
        needsGrading
      });
    }

    result.answers = formattedAnswers;
    result.autoScore = autoScore;
    result.autoMaxScore = autoMaxScore;
    result.totalScore = totalMaxScore;
    result.pointsEarned = pointsEarned;
    result.requiresManualReview = requiresManualReview;
    result.score = totalMaxScore > 0 ? Math.round((pointsEarned / totalMaxScore) * 100) : 0;
    result.status = requiresManualReview ? 'submitted' : 'completed';
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
