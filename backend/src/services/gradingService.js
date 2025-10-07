const Result = require('../models/Result');
const Question = require('../models/Question');
const questionValidator = require('./questionValidatorService');

/**
 * @desc    Get all results that need manual grading for a quiz
 * @param   {String} quizId - Quiz ID
 * @returns {Array} Results needing grading
 */
exports.getResultsNeedingGrading = async (quizId) => {
  try {
    const results = await Result.find({
      quiz: quizId,
      status: { $in: ['submitted'] },
      $or: [
        { requiresManualReview: true },
        { 'answers.needsGrading': true }
      ]
    })
      .populate('user', 'username email firstName lastName profile.name')
      .populate({
        path: 'answers.questionId',
        select: 'questionText questionType maxScore points rubric options referenceSolution'
      })
      .sort({ submittedAt: 1 });

    return results.map(result => {
      const plain = result.toObject({ virtuals: true });
      const needsGradingAnswers = (plain.answers || []).filter(answer => answer.needsGrading);

      const normalizedAnswers = needsGradingAnswers.map(answer => {
        const questionDoc = answer.questionId && answer.questionId._id ? answer.questionId : null;
        const maxScore = questionDoc?.maxScore ?? questionDoc?.points ?? answer.maxScore ?? 1;
        const normalizedQuestion = questionDoc
          ? {
              ...questionDoc,
              type: questionDoc.type || questionDoc.questionType,
              questionType: questionDoc.questionType || questionDoc.type,
              maxScore
            }
          : answer.questionId;

        return {
          ...answer,
          _id: answer._id ? answer._id.toString() : undefined,
          questionId: normalizedQuestion,
          maxScore,
          resultId: plain._id?.toString(),
          answer: answer.answer || {
            text: answer.textAnswer,
            selectedOption: answer.selectedOption,
            codeAnswer: answer.codeAnswer,
            blankAnswers: answer.blankAnswers,
            matchingAnswers: answer.matchingAnswers,
            essayAnswer: answer.essayAnswer,
            uploadedFiles: answer.uploadedFiles
          }
        };
      });

      const student = plain.user || {};
      const fallbackName =
        student.name ||
        student.fullName ||
        student.username ||
        (student.profile && student.profile.name) ||
        student.email ||
        'Unknown Student';

      return {
        ...plain,
        studentId: {
          _id: student._id?.toString(),
          name: fallbackName,
          email: student.email
        },
        answers: normalizedAnswers,
        totalNeedingGrading: normalizedAnswers.length
      };
    });
  } catch (error) {
    throw new Error(`Error fetching results needing grading: ${error.message}`);
  }
};

/**
 * @desc    Grade a single answer
 * @param   {String} resultId - Result ID
 * @param   {String} questionId - Question ID
 * @param   {Object} gradingData - Grading information
 * @returns {Object} Updated result
 */
exports.gradeAnswer = async (resultId, questionId, gradingData, graderId) => {
  try {
    const result = await Result.findById(resultId).populate({
      path: 'answers.questionId',
      select: 'questionText questionType maxScore points rubric options referenceSolution'
    });

    if (!result) {
      throw new Error('Result not found');
    }

    const answer = result.answers.find(
      a =>
        (a.questionId?._id?.toString() || a.questionId?.toString()) ===
        questionId.toString()
    );

    if (!answer) {
      throw new Error('Answer not found in result');
    }

    let question =
      answer.questionId && answer.questionId._id ? answer.questionId : null;

    if (!question) {
      question = await Question.findById(answer.questionId);
    }

    if (!question) {
      throw new Error('Question data not found for grading');
    }

    // Validate grading data
    const questionMaxScore = Number.isFinite(question.maxScore)
      ? question.maxScore
      : Number.isFinite(question.points)
        ? question.points
        : Number.isFinite(answer.maxScore)
          ? answer.maxScore
          : 1;

    if (gradingData.awardedScore < 0 || gradingData.awardedScore > questionMaxScore) {
      throw new Error(`Awarded score must be between 0 and ${questionMaxScore}`);
    }

    // Update answer
    answer.awardedScore = gradingData.awardedScore;
    answer.maxScore = questionMaxScore;
    answer.isCorrect = gradingData.awardedScore === questionMaxScore;
    answer.needsGrading = false;
    answer.gradedBy = graderId;
    answer.gradedAt = new Date();

    if (gradingData.feedback) {
      answer.feedback = gradingData.feedback;
    }

    if (gradingData.rubricScores) {
      answer.rubricScores = gradingData.rubricScores;
    }

    // Recalculate total score
    result.calculateScore();

    // Check if all answers are graded
    const stillNeedsGrading = result.checkNeedsManualGrading();
    if (!stillNeedsGrading) {
      result.manuallyGraded = true;
      result.requiresManualReview = false;
      result.status = 'completed';
    }

    await result.save();

    return result;
  } catch (error) {
    throw new Error(`Error grading answer: ${error.message}`);
  }
};

/**
 * @desc    Grade with rubric
 * @param   {String} resultId - Result ID
 * @param   {String} questionId - Question ID
 * @param   {Map} rubricScores - Rubric scores map
 * @param   {String} feedback - Optional feedback
 * @param   {String} graderId - Grader user ID
 * @returns {Object} Updated result
 */
exports.gradeWithRubric = async (resultId, questionId, rubricScores, feedback, graderId) => {
  try {
    const result = await Result.findById(resultId).populate({
      path: 'answers.questionId',
      select: 'questionText questionType maxScore points rubric options referenceSolution'
    });

    if (!result) {
      throw new Error('Result not found');
    }

    const answer = result.answers.find(
      a =>
        (a.questionId?._id?.toString() || a.questionId?.toString()) ===
        questionId.toString()
    );

    if (!answer) {
      throw new Error('Answer not found in result');
    }

    let question =
      answer.questionId && answer.questionId._id ? answer.questionId : null;

    if (!question) {
      question = await Question.findById(answer.questionId);
    }

    if (!question) {
      throw new Error('Question data not found for grading');
    }

    // Normalize rubric scores to align with rubric definition
    const normalizedRubricScores = new Map();

    if (Array.isArray(question.rubric)) {
      question.rubric.forEach(criterion => {
        const keyCandidates = [
          criterion._id?.toString(),
          criterion.id?.toString(),
          criterion.name
        ];

        let resolvedScore = 0;
        for (const key of keyCandidates) {
          if (key && rubricScores.has(key)) {
            const rawScore = rubricScores.get(key);
            const numericScore = Number.parseFloat(rawScore);
            resolvedScore = Number.isNaN(numericScore) ? 0 : numericScore;
            break;
          }
        }

        normalizedRubricScores.set(criterion.name, resolvedScore);
      });
    }

    // Validate rubric scores
    const rubricResult = questionValidator.gradeWithRubric(question, normalizedRubricScores);

    if (!rubricResult.isValid) {
      throw new Error(rubricResult.error);
    }

    // Update answer
    const questionMaxScore = Number.isFinite(question.maxScore)
      ? question.maxScore
      : Number.isFinite(question.points)
        ? question.points
        : Number.isFinite(answer.maxScore)
          ? answer.maxScore
          : Number.isFinite(rubricResult.maxScore)
            ? rubricResult.maxScore
            : 1;

    answer.awardedScore = rubricResult.awardedScore;
    answer.maxScore = questionMaxScore;
    answer.isCorrect = rubricResult.awardedScore === questionMaxScore;
    answer.needsGrading = false;
    answer.gradedBy = graderId;
    answer.gradedAt = new Date();
  answer.rubricScores = Object.fromEntries(normalizedRubricScores);
    if (feedback) {
      answer.feedback = feedback;
    }

    // Recalculate total score
    result.calculateScore();

    // Check if all answers are graded
    const stillNeedsGrading = result.checkNeedsManualGrading();
    if (!stillNeedsGrading) {
      result.manuallyGraded = true;
      result.requiresManualReview = false;
      result.status = 'completed';
    }

    await result.save();

    return result;
  } catch (error) {
    throw new Error(`Error grading with rubric: ${error.message}`);
  }
};

/**
 * @desc    Bulk grade multiple answers
 * @param   {String} resultId - Result ID
 * @param   {Array} gradings - Array of {questionId, awardedScore, feedback}
 * @param   {String} graderId - Grader user ID
 * @returns {Object} Updated result
 */
exports.bulkGrade = async (resultId, gradings, graderId) => {
  try {
    const result = await Result.findById(resultId).populate({
      path: 'answers.questionId',
      select: 'questionText questionType maxScore points rubric options referenceSolution'
    });

    if (!result) {
      throw new Error('Result not found');
    }

    // Grade each answer
    for (const grading of gradings) {
      const answer = result.answers.find(
        a =>
          (a.questionId?._id?.toString() || a.questionId?.toString()) ===
          grading.questionId.toString()
      );

      if (answer) {
        let question =
          answer.questionId && answer.questionId._id ? answer.questionId : null;

        if (!question) {
          question = await Question.findById(answer.questionId);
        }

        if (!question) {
          throw new Error('Question data not found for grading');
        }

        // Validate score
        const questionMaxScore = Number.isFinite(question.maxScore)
          ? question.maxScore
          : Number.isFinite(question.points)
            ? question.points
            : Number.isFinite(answer.maxScore)
              ? answer.maxScore
              : 1;

        if (grading.awardedScore < 0 || grading.awardedScore > questionMaxScore) {
          throw new Error(
            `Awarded score for question ${grading.questionId} must be between 0 and ${questionMaxScore}`
          );
        }

        answer.awardedScore = grading.awardedScore;
        answer.maxScore = questionMaxScore;
        answer.isCorrect = grading.awardedScore === questionMaxScore;
        answer.needsGrading = false;
        answer.gradedBy = graderId;
        answer.gradedAt = new Date();

        if (grading.feedback) {
          answer.feedback = grading.feedback;
        }

        if (grading.rubricScores) {
          answer.rubricScores = grading.rubricScores;
        }
      }
    }

    // Recalculate total score
    result.calculateScore();

    // Check if all answers are graded
    const stillNeedsGrading = result.checkNeedsManualGrading();
    if (!stillNeedsGrading) {
      result.manuallyGraded = true;
      result.requiresManualReview = false;
      result.status = 'completed';
    }

    await result.save();

    return result;
  } catch (error) {
    throw new Error(`Error bulk grading: ${error.message}`);
  }
};

/**
 * @desc    Add instructor feedback to result
 * @param   {String} resultId - Result ID
 * @param   {String} feedback - Feedback text
 * @param   {String} instructorId - Instructor user ID
 * @returns {Object} Updated result
 */
exports.addInstructorFeedback = async (resultId, feedback, instructorId) => {
  try {
    const result = await Result.findById(resultId);

    if (!result) {
      throw new Error('Result not found');
    }

    result.instructorFeedback = feedback;
    result.feedbackGivenBy = instructorId;
    result.feedbackGivenAt = new Date();

    await result.save();

    return result;
  } catch (error) {
    throw new Error(`Error adding feedback: ${error.message}`);
  }
};

/**
 * @desc    Get grading statistics for a quiz
 * @param   {String} quizId - Quiz ID
 * @returns {Object} Grading statistics
 */
exports.getGradingStatistics = async (quizId) => {
  try {
    const results = await Result.find({
      quiz: quizId,
      status: { $in: ['submitted', 'completed'] }
    });

    const total = results.length;
    const needsGrading = results.filter(r => 
      r.answers.some(a => a.needsGrading)
    ).length;
    const fullyGraded = results.filter(r => 
      r.manuallyGraded || !r.answers.some(a => a.needsGrading)
    ).length;

    // Count questions needing grading by type
    const questionTypeCounts = {
      essay: 0,
      'file-upload': 0,
      code: 0
    };

    results.forEach(result => {
      result.answers.forEach(answer => {
        if (answer.needsGrading && answer.questionType) {
          questionTypeCounts[answer.questionType] = 
            (questionTypeCounts[answer.questionType] || 0) + 1;
        }
      });
    });

    return {
      total,
      needsGrading,
      fullyGraded,
      percentageGraded: total > 0 ? (fullyGraded / total) * 100 : 0,
      questionTypeCounts
    };
  } catch (error) {
    throw new Error(`Error fetching grading statistics: ${error.message}`);
  }
};

/**
 * @desc    Auto-grade all objective questions in a result
 * @param   {String} resultId - Result ID
 * @returns {Object} Updated result
 */
exports.autoGradeObjectiveQuestions = async (resultId) => {
  try {
    const result = await Result.findById(resultId).populate({
      path: 'answers.questionId',
      select: 'questionText questionType maxScore points rubric options referenceSolution'
    });

    if (!result) {
      throw new Error('Result not found');
    }

    // Auto-grade only objective question types
    const objectiveTypes = ['multiple-choice', 'true-false', 'fill-in-blank', 'matching'];

    for (const answer of result.answers) {
      if (objectiveTypes.includes(answer.questionType) && answer.needsGrading) {
        let question =
          answer.questionId && answer.questionId._id ? answer.questionId : null;

        if (!question) {
          question = await Question.findById(answer.questionId);
        }

        if (!question) {
          continue;
        }

        const validationResult = await questionValidator.validateAnswer(question, answer);

        if (validationResult.isValid && !validationResult.needsGrading) {
          answer.awardedScore = validationResult.awardedScore;
          answer.isCorrect = validationResult.isCorrect;
          answer.needsGrading = false;
        }
      }
    }

    // Recalculate total score
    result.calculateScore();

    // Check if all answers are graded
    const stillNeedsGrading = result.checkNeedsManualGrading();
    if (!stillNeedsGrading) {
      result.manuallyGraded = false; // Auto-graded, not manually graded
      result.requiresManualReview = false;
      result.status = 'completed';
    }

    await result.save();

    return result;
  } catch (error) {
    throw new Error(`Error auto-grading: ${error.message}`);
  }
};
