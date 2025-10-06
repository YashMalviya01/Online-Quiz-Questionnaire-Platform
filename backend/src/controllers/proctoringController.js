const ProctoringViolation = require('../models/ProctoringViolation');
const Result = require('../models/Result');
const User = require('../models/User');

/**
 * Report violation (called by student's browser during quiz)
 */
const reportViolation = async (req, res, next) => {
  try {
    const { quizId, attemptId, violationType, severity, warningLevel, data } = req.body;

    if (!quizId || !attemptId || !violationType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const violation = await ProctoringViolation.create({
      quiz: quizId,
      student: req.user._id,
      attemptId,
      violationType,
      severity: severity || 'medium',
      warningLevel: warningLevel || 'medium',
      data: data || {},
      timestamp: new Date(),
      adminNotified: ['critical', 'high'].includes(severity),
      studentWarned: true,
      studentWarnedAt: new Date()
    });

    res.json({
      success: true,
      violation: {
        id: violation._id,
        type: violation.violationType,
        severity: violation.severity,
        timestamp: violation.timestamp
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get violations for a specific attempt (admin/student)
 */
const getAttemptViolations = async (req, res, next) => {
  try {
    const { attemptId } = req.params;

    const violations = await ProctoringViolation.find({ attemptId })
      .sort({ timestamp: -1 })
      .populate('student', 'username email')
      .populate('quiz', 'title');

    const summary = {
      total: violations.length,
      bySeverity: {
        critical: violations.filter(v => v.severity === 'critical').length,
        high: violations.filter(v => v.severity === 'high').length,
        medium: violations.filter(v => v.severity === 'medium').length,
        low: violations.filter(v => v.severity === 'low').length
      },
      byType: {}
    };

    violations.forEach(v => {
      summary.byType[v.violationType] = (summary.byType[v.violationType] || 0) + 1;
    });

    res.json({
      violations,
      summary
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all unreviewed violations (admin only)
 */
const getUnreviewedViolations = async (req, res, next) => {
  try {
    const { severity, page = 1, limit = 50 } = req.query;

    const query = {
      adminNotified: true,
      actionTaken: 'none'
    };

    if (severity) {
      query.severity = severity;
    }

    const violations = await ProctoringViolation.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('student', 'username email firstName lastName')
      .populate('quiz', 'title')
      .lean();

    const total = await ProctoringViolation.countDocuments(query);

    res.json({
      violations,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get violations by student (admin only)
 */
const getStudentViolations = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { quizId } = req.query;

    const query = { student: studentId };
    if (quizId) {
      query.quiz = quizId;
    }

    const violations = await ProctoringViolation.find(query)
      .sort({ timestamp: -1 })
      .populate('quiz', 'title')
      .lean();

    const summary = {
      totalViolations: violations.length,
      bySeverity: {
        critical: violations.filter(v => v.severity === 'critical').length,
        high: violations.filter(v => v.severity === 'high').length,
        medium: violations.filter(v => v.severity === 'medium').length,
        low: violations.filter(v => v.severity === 'low').length
      },
      actionsTaken: {
        disqualified: violations.filter(v => v.actionTaken === 'disqualified').length,
        warnings: violations.filter(v => v.actionTaken === 'warning_issued').length,
        dismissed: violations.filter(v => v.actionTaken === 'dismissed').length
      }
    };

    res.json({
      violations,
      summary
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Review violation and take action (admin only)
 */
const reviewViolation = async (req, res, next) => {
  try {
    const { violationId } = req.params;
    const { actionTaken, adminNotes } = req.body;

    if (!['none', 'warning_issued', 'disqualified', 'flagged_for_review', 'dismissed'].includes(actionTaken)) {
      return res.status(400).json({ message: 'Invalid action type' });
    }

    const violation = await ProctoringViolation.findByIdAndUpdate(
      violationId,
      {
        actionTaken,
        adminNotes,
        reviewedBy: req.user._id,
        reviewedAt: new Date()
      },
      { new: true }
    ).populate('student', 'username email');

    if (!violation) {
      return res.status(404).json({ message: 'Violation not found' });
    }

    // If disqualified, update the result
    if (actionTaken === 'disqualified') {
      await Result.findOneAndUpdate(
        { 
          quiz: violation.quiz,
          student: violation.student._id
        },
        {
          disqualified: true,
          disqualificationReason: `Proctoring violation: ${violation.violationType}`,
          disqualifiedBy: req.user._id,
          disqualifiedAt: new Date()
        }
      );
    }

    res.json({
      success: true,
      message: `Action taken: ${actionTaken}`,
      violation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Disqualify student from quiz (admin only)
 */
const disqualifyStudent = async (req, res, next) => {
  try {
    const { quizId, studentId } = req.body;
    const { reason } = req.body;

    if (!quizId || !studentId) {
      return res.status(400).json({ message: 'Quiz ID and Student ID are required' });
    }

    // Find the result
    const result = await Result.findOne({
      quiz: quizId,
      student: studentId
    });

    if (!result) {
      return res.status(404).json({ message: 'Quiz attempt not found' });
    }

    if (result.disqualified) {
      return res.status(400).json({ message: 'Student already disqualified' });
    }

    // Update result
    result.disqualified = true;
    result.disqualificationReason = reason || 'Violated proctoring guidelines';
    result.disqualifiedBy = req.user._id;
    result.disqualifiedAt = new Date();
    result.score = 0; // Set score to 0
    await result.save();

    // Update all related violations
    await ProctoringViolation.updateMany(
      {
        quiz: quizId,
        student: studentId,
        actionTaken: 'none'
      },
      {
        actionTaken: 'disqualified',
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
        adminNotes: reason || 'Student disqualified by admin'
      }
    );

    res.json({
      success: true,
      message: 'Student disqualified from quiz',
      result: {
        id: result._id,
        score: result.score,
        disqualified: result.disqualified,
        disqualificationReason: result.disqualificationReason
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get real-time violation stats for dashboard (admin only)
 */
const getViolationStats = async (req, res, next) => {
  try {
    const { timeRange = '24h' } = req.query;

    const timeRanges = {
      '1h': 1 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const since = new Date(Date.now() - (timeRanges[timeRange] || timeRanges['24h']));

    const [
      totalViolations,
      criticalViolations,
      unreviewedViolations,
      disqualifiedStudents,
      violationsByType
    ] = await Promise.all([
      ProctoringViolation.countDocuments({ timestamp: { $gte: since } }),
      ProctoringViolation.countDocuments({ 
        timestamp: { $gte: since },
        severity: 'critical'
      }),
      ProctoringViolation.countDocuments({
        timestamp: { $gte: since },
        actionTaken: 'none',
        adminNotified: true
      }),
      Result.countDocuments({
        disqualified: true,
        disqualifiedAt: { $gte: since }
      }),
      ProctoringViolation.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: { _id: '$violationType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({
      timeRange,
      stats: {
        totalViolations,
        criticalViolations,
        unreviewedViolations,
        disqualifiedStudents,
        violationsByType: violationsByType.map(v => ({
          type: v._id,
          count: v.count
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get live violations (for real-time monitoring)
 */
const getLiveViolations = async (req, res, next) => {
  try {
    const { since } = req.query;
    const sinceDate = since ? new Date(parseInt(since)) : new Date(Date.now() - 5 * 60 * 1000);

    const violations = await ProctoringViolation.find({
      timestamp: { $gte: sinceDate },
      severity: { $in: ['critical', 'high'] }
    })
      .sort({ timestamp: -1 })
      .limit(100)
      .populate('student', 'username email')
      .populate('quiz', 'title')
      .lean();

    res.json({
      violations,
      timestamp: Date.now()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  reportViolation,
  getAttemptViolations,
  getUnreviewedViolations,
  getStudentViolations,
  reviewViolation,
  disqualifyStudent,
  getViolationStats,
  getLiveViolations
};
