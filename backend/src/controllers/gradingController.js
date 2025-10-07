const gradingService = require('../services/gradingService');
const Quiz = require('../models/Quiz');

/**
 * @desc    Get all results needing grading for a quiz
 * @route   GET /api/grading/quiz/:quizId/pending
 * @access  Private (Instructor/Admin)
 */
exports.getPendingGrading = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Check if user has access to this quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const results = await gradingService.getResultsNeedingGrading(quizId);

    res.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Get pending grading error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending grading',
      error: error.message
    });
  }
};

/**
 * @desc    Grade a single answer
 * @route   POST /api/grading/result/:resultId/answer/:questionId
 * @access  Private (Instructor/Admin)
 */
exports.gradeAnswer = async (req, res) => {
  try {
    const { resultId, questionId } = req.params;
    const { awardedScore, feedback, rubricScores } = req.body;

    if (awardedScore === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Awarded score is required'
      });
    }

    const gradingData = {
      awardedScore: parseFloat(awardedScore),
      feedback,
      rubricScores
    };

    const result = await gradingService.gradeAnswer(
      resultId,
      questionId,
      gradingData,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Answer graded successfully',
      data: result
    });
  } catch (error) {
    console.error('Grade answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error grading answer',
      error: error.message
    });
  }
};

/**
 * @desc    Grade with rubric
 * @route   POST /api/grading/result/:resultId/answer/:questionId/rubric
 * @access  Private (Instructor/Admin)
 */
exports.gradeWithRubric = async (req, res) => {
  try {
    const { resultId, questionId } = req.params;
    const { rubricScores, feedback } = req.body;

    if (!rubricScores) {
      return res.status(400).json({
        success: false,
        message: 'Rubric scores are required'
      });
    }

    // Convert object to Map
    const scoresMap = new Map(Object.entries(rubricScores));

    const result = await gradingService.gradeWithRubric(
      resultId,
      questionId,
      scoresMap,
      feedback,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Answer graded with rubric successfully',
      data: result
    });
  } catch (error) {
    console.error('Grade with rubric error:', error);
    res.status(500).json({
      success: false,
      message: 'Error grading with rubric',
      error: error.message
    });
  }
};

/**
 * @desc    Bulk grade multiple answers
 * @route   POST /api/grading/result/:resultId/bulk
 * @access  Private (Instructor/Admin)
 */
exports.bulkGrade = async (req, res) => {
  try {
    const { resultId } = req.params;
    const { gradings } = req.body;

    if (!Array.isArray(gradings) || gradings.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Gradings array is required'
      });
    }

    const result = await gradingService.bulkGrade(
      resultId,
      gradings,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Answers graded successfully',
      data: result
    });
  } catch (error) {
    console.error('Bulk grade error:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk grading',
      error: error.message
    });
  }
};

/**
 * @desc    Add instructor feedback
 * @route   POST /api/grading/result/:resultId/feedback
 * @access  Private (Instructor/Admin)
 */
exports.addFeedback = async (req, res) => {
  try {
    const { resultId } = req.params;
    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({
        success: false,
        message: 'Feedback is required'
      });
    }

    const result = await gradingService.addInstructorFeedback(
      resultId,
      feedback,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Feedback added successfully',
      data: result
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding feedback',
      error: error.message
    });
  }
};

/**
 * @desc    Get grading statistics for a quiz
 * @route   GET /api/grading/quiz/:quizId/statistics
 * @access  Private (Instructor/Admin)
 */
exports.getGradingStatistics = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Check if user has access to this quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const stats = await gradingService.getGradingStatistics(quizId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get grading statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching grading statistics',
      error: error.message
    });
  }
};

/**
 * @desc    Auto-grade objective questions
 * @route   POST /api/grading/result/:resultId/auto-grade
 * @access  Private (Instructor/Admin)
 */
exports.autoGrade = async (req, res) => {
  try {
    const { resultId } = req.params;

    const result = await gradingService.autoGradeObjectiveQuestions(resultId);

    res.json({
      success: true,
      message: 'Objective questions auto-graded successfully',
      data: result
    });
  } catch (error) {
    console.error('Auto-grade error:', error);
    res.status(500).json({
      success: false,
      message: 'Error auto-grading',
      error: error.message
    });
  }
};
