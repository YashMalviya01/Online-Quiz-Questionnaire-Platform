const questionBankService = require('../services/questionBankService');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const { logAudit } = require('../services/auditService');

console.log('✓ Quiz Generation Controller initialized');
console.log('  Using: Question Bank Service (Topic-based)');

/**
 * Quiz Generation Controller
 * Handles quiz question generation from pre-built question bank
 */

/**
 * Check if question bank service is available
 */
exports.checkAvailability = async (req, res) => {
  try {
    const isAvailable = await questionBankService.isAvailable();
    const languages = questionBankService.getAvailableLanguages();
    
    res.json({
      available: isAvailable,
      service: 'Question Bank Service',
      languages: languages,
      message: isAvailable 
        ? `Question bank available with ${languages.length} languages`
        : 'Question bank is not available. Please check the data files.'
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
};

/**
 * Get available topics for a language
 */
exports.getAvailableTopics = async (req, res) => {
  try {
    const { language = 'javascript' } = req.query;
    const topics = questionBankService.getAvailableTopics(language);
    
    res.json({
      language,
      topics,
      count: topics.length
    });
  } catch (error) {
    console.error('Error getting topics:', error);
    res.status(500).json({ error: 'Failed to retrieve topics' });
  }
};

/**
 * Generate multiple choice questions
 */
exports.generateMultipleChoice = async (req, res) => {
  try {
    const { 
      topic, 
      difficulty = 'medium', 
      count = 5, 
      saveToBank = false, 
      category = 'Generated',
      language = 'javascript'
    } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (count < 1 || count > 20) {
      return res.status(400).json({ error: 'Count must be between 1 and 20' });
    }

    console.log(`Generating ${count} multiple choice question(s) about "${topic}" (${difficulty}) for ${language}`);

    // Generate questions from question bank
    const generatedQuestions = await questionBankService.generateMultipleChoice({
      topic,
      difficulty,
      count,
      language
    });

    if (generatedQuestions.length === 0) {
      return res.status(404).json({ 
        error: 'No questions found for the specified criteria',
        suggestion: 'Try a different topic or difficulty level'
      });
    }

    // Optionally save to question bank
    if (saveToBank && req.user) {
      try {
        const savedQuestions = await Question.insertMany(
          generatedQuestions.map(q => ({
            ...q,
            createdBy: req.user.userId,
            category
          }))
        );

        // Log audit trail
        await logAudit({
          action: 'QUESTIONS_GENERATED',
          userId: req.user.userId,
          details: {
            count: savedQuestions.length,
            topic,
            difficulty,
            language,
            questionType: 'multiple-choice'
          }
        });

        console.log(`✓ Saved ${savedQuestions.length} questions to database`);
      } catch (saveError) {
        console.error('Error saving questions:', saveError);
        // Continue even if save fails
      }
    }

    res.json({
      success: true,
      questions: generatedQuestions,
      count: generatedQuestions.length,
      topic,
      difficulty,
      language
    });

  } catch (error) {
    console.error('Error generating multiple choice questions:', error);
    res.status(500).json({ 
      error: 'Failed to generate questions',
      message: error.message
    });
  }
};

/**
 * Generate true/false questions
 */
exports.generateTrueFalse = async (req, res) => {
  try {
    const { 
      topic, 
      difficulty = 'medium', 
      count = 5, 
      saveToBank = false, 
      category = 'Generated',
      language = 'javascript'
    } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (count < 1 || count > 20) {
      return res.status(400).json({ error: 'Count must be between 1 and 20' });
    }

    console.log(`Generating ${count} true/false question(s) about "${topic}" (${difficulty}) for ${language}`);

    const generatedQuestions = await questionBankService.generateTrueFalse({
      topic,
      difficulty,
      count,
      language
    });

    if (generatedQuestions.length === 0) {
      return res.status(404).json({ 
        error: 'No true/false questions found for the specified criteria',
        suggestion: 'Try a different topic or difficulty level'
      });
    }

    if (saveToBank && req.user) {
      try {
        await Question.insertMany(
          generatedQuestions.map(q => ({
            ...q,
            createdBy: req.user.userId,
            category
          }))
        );
        
        await logAudit({
          action: 'QUESTIONS_GENERATED',
          userId: req.user.userId,
          details: {
            count: generatedQuestions.length,
            topic,
            difficulty,
            language,
            questionType: 'true-false'
          }
        });
      } catch (saveError) {
        console.error('Error saving questions:', saveError);
      }
    }

    res.json({
      success: true,
      questions: generatedQuestions,
      count: generatedQuestions.length,
      topic,
      difficulty,
      language
    });

  } catch (error) {
    console.error('Error generating true/false questions:', error);
    res.status(500).json({ 
      error: 'Failed to generate questions',
      message: error.message
    });
  }
};

/**
 * Generate fill in the blank questions
 */
exports.generateFillInTheBlank = async (req, res) => {
  try {
    const { 
      topic, 
      difficulty = 'medium', 
      count = 5, 
      saveToBank = false, 
      category = 'Generated',
      language = 'javascript'
    } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (count < 1 || count > 20) {
      return res.status(400).json({ error: 'Count must be between 1 and 20' });
    }

    console.log(`Generating ${count} fill-in-the-blank question(s) about "${topic}" (${difficulty}) for ${language}`);

    const generatedQuestions = await questionBankService.generateFillInTheBlank({
      topic,
      difficulty,
      count,
      language
    });

    if (generatedQuestions.length === 0) {
      return res.status(404).json({ 
        error: 'No fill-in-the-blank questions found for the specified criteria',
        suggestion: 'Try a different topic or difficulty level'
      });
    }

    if (saveToBank && req.user) {
      try {
        await Question.insertMany(
          generatedQuestions.map(q => ({
            ...q,
            createdBy: req.user.userId,
            category
          }))
        );
        
        await logAudit({
          action: 'QUESTIONS_GENERATED',
          userId: req.user.userId,
          details: {
            count: generatedQuestions.length,
            topic,
            difficulty,
            language,
            questionType: 'fill-in-the-blank'
          }
        });
      } catch (saveError) {
        console.error('Error saving questions:', saveError);
      }
    }

    res.json({
      success: true,
      questions: generatedQuestions,
      count: generatedQuestions.length,
      topic,
      difficulty,
      language
    });

  } catch (error) {
    console.error('Error generating fill-in-the-blank questions:', error);
    res.status(500).json({ 
      error: 'Failed to generate questions',
      message: error.message
    });
  }
};

/**
 * Generate coding questions
 */
exports.generateCoding = async (req, res) => {
  try {
    const { 
      topic, 
      difficulty = 'medium', 
      count = 3, 
      saveToBank = false, 
      category = 'Generated',
      language = 'javascript'
    } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (count < 1 || count > 10) {
      return res.status(400).json({ error: 'Count must be between 1 and 10' });
    }

    console.log(`Generating ${count} coding question(s) about "${topic}" (${difficulty}) for ${language}`);

    const generatedQuestions = await questionBankService.generateCoding({
      topic,
      difficulty,
      count,
      language
    });

    if (saveToBank && req.user) {
      try {
        await Question.insertMany(
          generatedQuestions.map(q => ({
            ...q,
            createdBy: req.user.userId,
            category
          }))
        );
        
        await logAudit({
          action: 'QUESTIONS_GENERATED',
          userId: req.user.userId,
          details: {
            count: generatedQuestions.length,
            topic,
            difficulty,
            language,
            questionType: 'code'
          }
        });
      } catch (saveError) {
        console.error('Error saving questions:', saveError);
      }
    }

    res.json({
      success: true,
      questions: generatedQuestions,
      count: generatedQuestions.length,
      topic,
      difficulty,
      language
    });

  } catch (error) {
    console.error('Error generating coding questions:', error);
    res.status(500).json({ 
      error: 'Failed to generate questions',
      message: error.message
    });
  }
};

/**
 * Generate mixed type questions
 */
exports.generateMixed = async (req, res) => {
  try {
    const { 
      topic, 
      difficulty = 'medium', 
      count = 10, 
      saveToBank = false, 
      category = 'Generated',
      language = 'javascript'
    } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (count < 1 || count > 50) {
      return res.status(400).json({ error: 'Count must be between 1 and 50' });
    }

    console.log(`Generating ${count} mixed question(s) about "${topic}" (${difficulty}) for ${language}`);

    const generatedQuestions = await questionBankService.generateMixed({
      topic,
      difficulty,
      count,
      language
    });

    if (generatedQuestions.length === 0) {
      return res.status(404).json({ 
        error: 'No questions found for the specified criteria',
        suggestion: 'Try a different topic, difficulty level, or language'
      });
    }

    if (saveToBank && req.user) {
      try {
        await Question.insertMany(
          generatedQuestions.map(q => ({
            ...q,
            createdBy: req.user.userId,
            category
          }))
        );
        
        await logAudit({
          action: 'QUESTIONS_GENERATED',
          userId: req.user.userId,
          details: {
            count: generatedQuestions.length,
            topic,
            difficulty,
            language,
            questionType: 'mixed'
          }
        });
      } catch (saveError) {
        console.error('Error saving questions:', saveError);
      }
    }

    res.json({
      success: true,
      questions: generatedQuestions,
      count: generatedQuestions.length,
      topic,
      difficulty,
      language
    });

  } catch (error) {
    console.error('Error generating mixed questions:', error);
    res.status(500).json({ 
      error: 'Failed to generate questions',
      message: error.message
    });
  }
};

module.exports = exports;
