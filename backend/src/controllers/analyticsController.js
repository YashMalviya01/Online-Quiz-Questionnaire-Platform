const QuizAnalytics = require('../models/QuizAnalytics');
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');

/**
 * @desc    Get quiz analytics
 * @route   GET /api/analytics/quiz/:quizId
 * @access  Private (Instructor/Admin)
 */
exports.getQuizAnalytics = async (req, res) => {
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

    // Find or create analytics
    let analytics = await QuizAnalytics.findOne({ quiz: quizId });

    if (!analytics) {
      analytics = new QuizAnalytics({ quiz: quizId });
      await analytics.save();
    }

    // Recalculate analytics
    await analytics.recalculate();

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get quiz analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz analytics',
      error: error.message
    });
  }
};

/**
 * @desc    Get question-level analytics
 * @route   GET /api/analytics/quiz/:quizId/questions
 * @access  Private (Instructor/Admin)
 */
exports.getQuestionAnalytics = async (req, res) => {
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

    // Get analytics
    let analytics = await QuizAnalytics.findOne({ quiz: quizId });

    if (!analytics) {
      analytics = new QuizAnalytics({ quiz: quizId });
      await analytics.save();
      await analytics.recalculate();
    }

    res.json({
      success: true,
      data: analytics.questionAnalytics
    });
  } catch (error) {
    console.error('Get question analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching question analytics',
      error: error.message
    });
  }
};

/**
 * @desc    Get at-risk students
 * @route   GET /api/analytics/quiz/:quizId/at-risk
 * @access  Private (Instructor/Admin)
 */
exports.getAtRiskStudents = async (req, res) => {
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

    // Get analytics
    let analytics = await QuizAnalytics.findOne({ quiz: quizId })
      .populate('atRiskStudents.studentId', 'name email');

    if (!analytics) {
      analytics = new QuizAnalytics({ quiz: quizId });
      await analytics.save();
      await analytics.recalculate();
      analytics = await QuizAnalytics.findOne({ quiz: quizId })
        .populate('atRiskStudents.studentId', 'name email');
    }

    res.json({
      success: true,
      data: analytics.atRiskStudents
    });
  } catch (error) {
    console.error('Get at-risk students error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching at-risk students',
      error: error.message
    });
  }
};

/**
 * @desc    Get top performers
 * @route   GET /api/analytics/quiz/:quizId/top-performers
 * @access  Private (Instructor/Admin)
 */
exports.getTopPerformers = async (req, res) => {
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

    // Get analytics
    let analytics = await QuizAnalytics.findOne({ quiz: quizId })
      .populate('topPerformers.studentId', 'name email');

    if (!analytics) {
      analytics = new QuizAnalytics({ quiz: quizId });
      await analytics.save();
      await analytics.recalculate();
      analytics = await QuizAnalytics.findOne({ quiz: quizId })
        .populate('topPerformers.studentId', 'name email');
    }

    res.json({
      success: true,
      data: analytics.topPerformers
    });
  } catch (error) {
    console.error('Get top performers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top performers',
      error: error.message
    });
  }
};

/**
 * @desc    Get performance trends
 * @route   GET /api/analytics/quiz/:quizId/trends
 * @access  Private (Instructor/Admin)
 */
exports.getPerformanceTrends = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { startDate, endDate } = req.query;

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

    // Get analytics
    let analytics = await QuizAnalytics.findOne({ quiz: quizId });

    if (!analytics) {
      analytics = new QuizAnalytics({ quiz: quizId });
      await analytics.save();
      await analytics.recalculate();
    }

    let trends = analytics.performanceTrends;

    // Filter by date range if provided
    if (startDate || endDate) {
      trends = trends.filter(trend => {
        const trendDate = new Date(trend.date);
        if (startDate && trendDate < new Date(startDate)) return false;
        if (endDate && trendDate > new Date(endDate)) return false;
        return true;
      });
    }

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Get performance trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching performance trends',
      error: error.message
    });
  }
};

/**
 * @desc    Get violation statistics
 * @route   GET /api/analytics/quiz/:quizId/violations
 * @access  Private (Instructor/Admin)
 */
exports.getViolationStatistics = async (req, res) => {
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

    // Get analytics
    let analytics = await QuizAnalytics.findOne({ quiz: quizId });

    if (!analytics) {
      analytics = new QuizAnalytics({ quiz: quizId });
      await analytics.save();
      await analytics.recalculate();
    }

    res.json({
      success: true,
      data: analytics.violationStats
    });
  } catch (error) {
    console.error('Get violation statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching violation statistics',
      error: error.message
    });
  }
};

/**
 * @desc    Export analytics report
 * @route   GET /api/analytics/quiz/:quizId/export
 * @access  Private (Instructor/Admin)
 */
exports.exportAnalyticsReport = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { format = 'json' } = req.query;

    // Check if user has access to this quiz
    const quiz = await Quiz.findById(quizId).populate('questions');
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

    // Get analytics
    let analytics = await QuizAnalytics.findOne({ quiz: quizId });

    if (!analytics) {
      analytics = new QuizAnalytics({ quiz: quizId });
      await analytics.save();
      await analytics.recalculate();
    }

    const report = {
      quizTitle: quiz.title,
      generatedAt: new Date(),
      summary: {
        totalAttempts: analytics.totalAttempts,
        completionRate: analytics.completionRate,
        averageScore: analytics.averageScore,
        passRate: analytics.passRate,
        failRate: analytics.failRate
      },
      scoreDistribution: analytics.scoreDistribution,
      gradeDistribution: analytics.gradeDistribution,
      timeAnalytics: {
        averageCompletionTime: analytics.averageCompletionTime,
        fastestCompletion: analytics.fastestCompletion,
        slowestCompletion: analytics.slowestCompletion
      },
      questionAnalytics: analytics.questionAnalytics,
      performanceTrends: analytics.performanceTrends,
      violationStats: analytics.violationStats
    };

    if (format === 'csv') {
      // Convert to CSV (simplified version)
      const csv = convertToCSV(report);
      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', `attachment; filename="quiz-analytics-${quizId}.csv"`);
      res.send(csv);
    } else {
      // Return JSON
      res.json({
        success: true,
        data: report
      });
    }
  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting analytics',
      error: error.message
    });
  }
};

/**
 * Helper function to convert analytics to CSV
 */
function convertToCSV(report) {
  let csv = 'Quiz Analytics Report\n\n';
  csv += `Quiz Title,${report.quizTitle}\n`;
  csv += `Generated At,${report.generatedAt}\n\n`;
  
  csv += 'Summary\n';
  csv += 'Metric,Value\n';
  csv += `Total Attempts,${report.summary.totalAttempts}\n`;
  csv += `Completion Rate,${report.summary.completionRate}%\n`;
  csv += `Average Score,${report.summary.averageScore}%\n`;
  csv += `Pass Rate,${report.summary.passRate}%\n`;
  csv += `Fail Rate,${report.summary.failRate}%\n\n`;
  
  csv += 'Score Distribution\n';
  csv += 'Range,Count\n';
  Object.entries(report.scoreDistribution).forEach(([range, count]) => {
    csv += `${range},${count}\n`;
  });
  
  return csv;
}

/**
 * @desc    Recalculate all quiz analytics
 * @route   POST /api/analytics/quiz/:quizId/recalculate
 * @access  Private (Instructor/Admin)
 */
exports.recalculateAnalytics = async (req, res) => {
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

    // Find or create analytics
    let analytics = await QuizAnalytics.findOne({ quiz: quizId });

    if (!analytics) {
      analytics = new QuizAnalytics({ quiz: quizId });
      await analytics.save();
    }

    // Recalculate
    await analytics.recalculate();

    res.json({
      success: true,
      message: 'Analytics recalculated successfully',
      data: analytics
    });
  } catch (error) {
    console.error('Recalculate analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recalculating analytics',
      error: error.message
    });
  }
};
