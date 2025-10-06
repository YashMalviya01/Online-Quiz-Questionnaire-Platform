const QuestionBank = require('../models/QuestionBank');
const Question = require('../models/Question');
const { validationResult } = require('express-validator');

/**
 * @desc    Create a new question bank
 * @route   POST /api/question-banks
 * @access  Private (Instructor/Admin)
 */
exports.createQuestionBank = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, category, subject, tags, isPublic } = req.body;

    const questionBank = new QuestionBank({
      name,
      description,
      category,
      subject,
      tags: tags || [],
      owner: req.user.id,
      isPublic: isPublic || false
    });

    await questionBank.save();

    res.status(201).json({
      success: true,
      message: 'Question bank created successfully',
      data: questionBank
    });
  } catch (error) {
    console.error('Create question bank error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating question bank',
      error: error.message
    });
  }
};

/**
 * @desc    Get all question banks (with filters)
 * @route   GET /api/question-banks
 * @access  Private
 */
exports.getQuestionBanks = async (req, res) => {
  try {
    const { category, subject, tags, search, isPublic } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {
      $or: [
        { owner: req.user.id },
        { isPublic: true },
        { 'sharedWith.user': req.user.id }
      ]
    };

    if (category) query.category = category;
    if (subject) query.subject = subject;
    if (tags) query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    if (isPublic !== undefined) query.isPublic = isPublic === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const questionBanks = await QuestionBank.find(query)
      .populate('owner', 'name email')
      .populate('questions')
      .sort({ lastUsed: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await QuestionBank.countDocuments(query);

    res.json({
      success: true,
      data: questionBanks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get question banks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching question banks',
      error: error.message
    });
  }
};

/**
 * @desc    Get single question bank by ID
 * @route   GET /api/question-banks/:id
 * @access  Private
 */
exports.getQuestionBankById = async (req, res) => {
  try {
    const questionBank = await QuestionBank.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('questions')
      .populate('sharedWith.user', 'name email');

    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: 'Question bank not found'
      });
    }

    // Check permissions
    const hasAccess = 
      questionBank.owner._id.toString() === req.user.id ||
      questionBank.isPublic ||
      questionBank.sharedWith.some(share => share.user._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this question bank'
      });
    }

    res.json({
      success: true,
      data: questionBank
    });
  } catch (error) {
    console.error('Get question bank error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching question bank',
      error: error.message
    });
  }
};

/**
 * @desc    Update question bank
 * @route   PUT /api/question-banks/:id
 * @access  Private (Owner or Editor)
 */
exports.updateQuestionBank = async (req, res) => {
  try {
    const questionBank = await QuestionBank.findById(req.params.id);

    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: 'Question bank not found'
      });
    }

    // Check permissions (owner or editor)
    const isOwner = questionBank.owner.toString() === req.user.id;
    const isEditor = questionBank.sharedWith.some(
      share => share.user.toString() === req.user.id && share.permission === 'edit'
    );

    if (!isOwner && !isEditor) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit this question bank'
      });
    }

    const { name, description, category, subject, tags, isPublic } = req.body;

    if (name) questionBank.name = name;
    if (description) questionBank.description = description;
    if (category) questionBank.category = category;
    if (subject) questionBank.subject = subject;
    if (tags) questionBank.tags = tags;
    if (isPublic !== undefined && isOwner) questionBank.isPublic = isPublic;

    await questionBank.save();

    res.json({
      success: true,
      message: 'Question bank updated successfully',
      data: questionBank
    });
  } catch (error) {
    console.error('Update question bank error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating question bank',
      error: error.message
    });
  }
};

/**
 * @desc    Delete question bank
 * @route   DELETE /api/question-banks/:id
 * @access  Private (Owner only)
 */
exports.deleteQuestionBank = async (req, res) => {
  try {
    const questionBank = await QuestionBank.findById(req.params.id);

    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: 'Question bank not found'
      });
    }

    // Only owner can delete
    if (questionBank.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the owner can delete this question bank'
      });
    }

    await questionBank.deleteOne();

    res.json({
      success: true,
      message: 'Question bank deleted successfully'
    });
  } catch (error) {
    console.error('Delete question bank error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting question bank',
      error: error.message
    });
  }
};

/**
 * @desc    Add question to bank
 * @route   POST /api/question-banks/:id/questions
 * @access  Private (Owner or Editor)
 */
exports.addQuestionToBank = async (req, res) => {
  try {
    const { questionId } = req.body;

    const questionBank = await QuestionBank.findById(req.params.id);

    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: 'Question bank not found'
      });
    }

    // Check permissions
    const isOwner = questionBank.owner.toString() === req.user.id;
    const isEditor = questionBank.sharedWith.some(
      share => share.user.toString() === req.user.id && share.permission === 'edit'
    );

    if (!isOwner && !isEditor) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit this question bank'
      });
    }

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Add question using method
    await questionBank.addQuestion(questionId);

    res.json({
      success: true,
      message: 'Question added to bank successfully',
      data: questionBank
    });
  } catch (error) {
    console.error('Add question to bank error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding question to bank',
      error: error.message
    });
  }
};

/**
 * @desc    Remove question from bank
 * @route   DELETE /api/question-banks/:id/questions/:questionId
 * @access  Private (Owner or Editor)
 */
exports.removeQuestionFromBank = async (req, res) => {
  try {
    const { questionId } = req.params;

    const questionBank = await QuestionBank.findById(req.params.id);

    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: 'Question bank not found'
      });
    }

    // Check permissions
    const isOwner = questionBank.owner.toString() === req.user.id;
    const isEditor = questionBank.sharedWith.some(
      share => share.user.toString() === req.user.id && share.permission === 'edit'
    );

    if (!isOwner && !isEditor) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit this question bank'
      });
    }

    // Remove question using method
    await questionBank.removeQuestion(questionId);

    res.json({
      success: true,
      message: 'Question removed from bank successfully',
      data: questionBank
    });
  } catch (error) {
    console.error('Remove question from bank error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing question from bank',
      error: error.message
    });
  }
};

/**
 * @desc    Share question bank with user
 * @route   POST /api/question-banks/:id/share
 * @access  Private (Owner only)
 */
exports.shareQuestionBank = async (req, res) => {
  try {
    const { userId, permission } = req.body;

    if (!['view', 'edit'].includes(permission)) {
      return res.status(400).json({
        success: false,
        message: 'Permission must be either "view" or "edit"'
      });
    }

    const questionBank = await QuestionBank.findById(req.params.id);

    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: 'Question bank not found'
      });
    }

    // Only owner can share
    if (questionBank.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the owner can share this question bank'
      });
    }

    // Check if already shared with this user
    const existingShare = questionBank.sharedWith.find(
      share => share.user.toString() === userId
    );

    if (existingShare) {
      existingShare.permission = permission;
    } else {
      questionBank.sharedWith.push({
        user: userId,
        permission,
        sharedAt: new Date()
      });
    }

    await questionBank.save();

    res.json({
      success: true,
      message: 'Question bank shared successfully',
      data: questionBank
    });
  } catch (error) {
    console.error('Share question bank error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sharing question bank',
      error: error.message
    });
  }
};

/**
 * @desc    Unshare question bank
 * @route   DELETE /api/question-banks/:id/share/:userId
 * @access  Private (Owner only)
 */
exports.unshareQuestionBank = async (req, res) => {
  try {
    const { userId } = req.params;

    const questionBank = await QuestionBank.findById(req.params.id);

    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: 'Question bank not found'
      });
    }

    // Only owner can unshare
    if (questionBank.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the owner can unshare this question bank'
      });
    }

    questionBank.sharedWith = questionBank.sharedWith.filter(
      share => share.user.toString() !== userId
    );

    await questionBank.save();

    res.json({
      success: true,
      message: 'Question bank unshared successfully',
      data: questionBank
    });
  } catch (error) {
    console.error('Unshare question bank error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unsharing question bank',
      error: error.message
    });
  }
};

/**
 * @desc    Get question bank statistics
 * @route   GET /api/question-banks/:id/statistics
 * @access  Private
 */
exports.getQuestionBankStatistics = async (req, res) => {
  try {
    const questionBank = await QuestionBank.findById(req.params.id)
      .populate('questions');

    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: 'Question bank not found'
      });
    }

    // Check permissions
    const hasAccess = 
      questionBank.owner.toString() === req.user.id ||
      questionBank.isPublic ||
      questionBank.sharedWith.some(share => share.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this question bank'
      });
    }

    // Update statistics
    await questionBank.updateStatistics();

    res.json({
      success: true,
      data: {
        totalQuestions: questionBank.totalQuestions,
        questionsByDifficulty: questionBank.questionsByDifficulty,
        questionsByType: questionBank.questionsByType,
        usageCount: questionBank.usageCount,
        lastUsed: questionBank.lastUsed
      }
    });
  } catch (error) {
    console.error('Get question bank statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching question bank statistics',
      error: error.message
    });
  }
};
