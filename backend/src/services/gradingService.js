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
      status: 'completed',
      'answers.needsGrading': true
    })
      .populate('student', 'name email')
      .populate('answers.question')
      .sort({ submittedAt: 1 });

    // Filter to only include answers that need grading
    const filteredResults = results.map(result => {
      const needsGradingAnswers = result.answers.filter(answer => answer.needsGrading);
      return {
        ...result.toObject(),
        answers: needsGradingAnswers,
        totalNeedingGrading: needsGradingAnswers.length
      };
    });

    return filteredResults;
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
    const result = await Result.findById(resultId).populate('answers.question');

    if (!result) {
      throw new Error('Result not found');
    }

    const answer = result.answers.find(
      a => a.question._id.toString() === questionId.toString()
    );

    if (!answer) {
      throw new Error('Answer not found in result');
    }

    const question = answer.question;

    // Validate grading data
    if (gradingData.awardedScore < 0 || gradingData.awardedScore > question.points) {
      throw new Error(`Awarded score must be between 0 and ${question.points}`);
    }

    // Update answer
    answer.awardedScore = gradingData.awardedScore;
    answer.isCorrect = gradingData.awardedScore === question.points;
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
 * @param   {String} graderId - Grader user ID
 * @returns {Object} Updated result
 */
exports.gradeWithRubric = async (resultId, questionId, rubricScores, graderId) => {
  try {
    const result = await Result.findById(resultId).populate('answers.question');

    if (!result) {
      throw new Error('Result not found');
    }

    const answer = result.answers.find(
      a => a.question._id.toString() === questionId.toString()
    );

    if (!answer) {
      throw new Error('Answer not found in result');
    }

    const question = answer.question;

    // Validate rubric scores
    const rubricResult = questionValidator.gradeWithRubric(question, rubricScores);

    if (!rubricResult.isValid) {
      throw new Error(rubricResult.error);
    }

    // Update answer
    answer.awardedScore = rubricResult.awardedScore;
    answer.isCorrect = rubricResult.awardedScore === question.points;
    answer.needsGrading = false;
    answer.gradedBy = graderId;
    answer.gradedAt = new Date();
    answer.rubricScores = rubricScores;

    // Recalculate total score
    result.calculateScore();

    // Check if all answers are graded
    const stillNeedsGrading = result.checkNeedsManualGrading();
    if (!stillNeedsGrading) {
      result.manuallyGraded = true;
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
    const result = await Result.findById(resultId).populate('answers.question');

    if (!result) {
      throw new Error('Result not found');
    }

    // Grade each answer
    for (const grading of gradings) {
      const answer = result.answers.find(
        a => a.question._id.toString() === grading.questionId.toString()
      );

      if (answer) {
        const question = answer.question;

        // Validate score
        if (grading.awardedScore < 0 || grading.awardedScore > question.points) {
          throw new Error(
            `Awarded score for question ${grading.questionId} must be between 0 and ${question.points}`
          );
        }

        answer.awardedScore = grading.awardedScore;
        answer.isCorrect = grading.awardedScore === question.points;
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
      status: 'completed'
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
    const result = await Result.findById(resultId).populate('answers.question');

    if (!result) {
      throw new Error('Result not found');
    }

    // Auto-grade only objective question types
    const objectiveTypes = ['multiple-choice', 'true-false', 'fill-in-blank', 'matching'];

    for (const answer of result.answers) {
      if (objectiveTypes.includes(answer.questionType) && answer.needsGrading) {
        const question = answer.question;
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
    }

    await result.save();

    return result;
  } catch (error) {
    throw new Error(`Error auto-grading: ${error.message}`);
  }
};
