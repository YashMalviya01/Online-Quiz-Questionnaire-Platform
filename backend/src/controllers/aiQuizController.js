const ollamaService = require('../services/ollamaService');
const dockerModelService = require('../services/dockerModelService');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const { logAudit } = require('../services/auditService');

// Use Ollama with qwen2.5-coder:7b on Mac Mini M4
const aiService = ollamaService;

console.log('✓ AI Quiz Controller initialized');
console.log('  Using: Ollama with qwen2.5-coder:7b on Mac Mini M4');

/**
 * AI Quiz Generation Controller
 * Handles AI-powered quiz question generation using qwen2.5-coder:7b
 */

/**
 * Check if AI service is available
 */
exports.checkAIAvailability = async (req, res) => {
  try {
    const isAvailable = await aiService.isAvailable();
    
    res.json({
      available: isAvailable,
      service: 'Ollama (qwen2.5-coder:7b on Mac Mini M4)',
      message: isAvailable 
        ? 'Ollama with qwen2.5-coder:7b is available on Mac Mini M4 (10.108.51.85:11434)'
        : 'Ollama service is not available. Please ensure Mac Mini is running and accessible.'
    });
  } catch (error) {
    console.error('Error checking AI availability:', error);
    res.status(500).json({ error: 'Failed to check AI availability' });
  }
};

/**
 * Generate multiple choice questions
 */
exports.generateMultipleChoice = async (req, res) => {
  try {
    const { topic, difficulty = 'medium', count = 1, saveToBank = false, category = 'AI-Generated', customPrompt = '', language = 'javascript' } = req.body;

    // Validate: either topic or customPrompt must be provided
    if (!topic && !customPrompt) {
      return res.status(400).json({ error: 'Either topic or custom prompt is required' });
    }

    if (count < 1 || count > 20) {
      return res.status(400).json({ error: 'Count must be between 1 and 20' });
    }

    const topicDescription = topic || 'Custom prompt-based';
    console.log(`Generating ${count} multiple choice question(s) about "${topicDescription}" (${difficulty})`);
    if (customPrompt) {
      console.log(`Custom prompt: ${customPrompt.substring(0, 100)}...`);
    }

    // Generate questions with progress logging and custom prompt
    const generatedQuestions = await aiService.generateMultipleChoiceQuestion(
      topic, 
      difficulty, 
      count,
      customPrompt,
      (current, total) => {
        console.log(`Progress: Generated ${current}/${total} questions`);
      }
    );

    // Transform to our Question model format
    const questions = generatedQuestions.map(q => {
      // Handle correctAnswer: could be letter (A/B/C/D) or already the actual option
      let correctAnswerValue;
      if (typeof q.correctAnswer === 'string' && q.correctAnswer.length === 1 && /[A-D]/i.test(q.correctAnswer)) {
        // It's a letter (A/B/C/D), convert to option text
        const index = q.correctAnswer.toUpperCase().charCodeAt(0) - 65;
        correctAnswerValue = q.options[index] || q.options[0];
      } else if (Array.isArray(q.correctAnswer)) {
        // If array, take first element as string for frontend
        correctAnswerValue = q.correctAnswer[0];
      } else {
        // Assume it's already the option text
        correctAnswerValue = q.correctAnswer;
      }

      return {
        questionText: q.questionText,
        questionType: q.questionType || 'multiple-choice',
        options: q.options,
        correctAnswer: correctAnswerValue, // Now returns string instead of array
        points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30,
        timeLimit: q.estimatedTime || 60,
        difficulty,
        category,
        tags: [...(q.tags || []), 'ai-generated', topic || 'custom'],
        aiGenerated: {
          isAIGenerated: true,
          aiSource: 'ollama-qwen2.5-coder',
          generationDate: new Date(),
          topic,
          confidence: 0.95,
          explanation: q.explanation
        },
        createdBy: req.user.id
      };
    });

    // Save to database if requested
    if (saveToBank) {
      const savedQuestions = await Question.insertMany(questions);
      
      await logAudit({
        userId: req.user.id,
        action: 'AI_GENERATE_QUESTIONS',
        resource: 'Question',
        details: {
          topic,
          difficulty,
          count: savedQuestions.length,
          type: 'multiple-choice'
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      return res.status(201).json({
        success: true,
        message: `Generated and saved ${savedQuestions.length} questions`,
        questions: savedQuestions
      });
    }

    // Return without saving
    res.json({
      success: true,
      message: `Generated ${questions.length} questions`,
      questions
    });

  } catch (error) {
    console.error('Error generating multiple choice questions:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate questions'
    });
  }
};

/**
 * Generate true/false questions
 */
exports.generateTrueFalse = async (req, res) => {
  try {
    const { topic, customPrompt, difficulty = 'medium', count = 1, saveToBank = false, category = 'AI-Generated' } = req.body;

    // Validate: either topic or customPrompt must be provided
    if (!topic && !customPrompt) {
      return res.status(400).json({ error: 'Either topic or custom prompt is required' });
    }

    if (count < 1 || count > 20) {
      return res.status(400).json({ error: 'Count must be between 1 and 20' });
    }

    const effectiveTopic = topic || 'Custom Topic';
    const generatedQuestions = await aiService.generateTrueFalseQuestion(effectiveTopic, difficulty, customPrompt, count);
    
    // Ensure we have an array
    const questionsArray = Array.isArray(generatedQuestions) ? generatedQuestions : [generatedQuestions];

    const questions = questionsArray.map(q => ({
      questionText: q.questionText,
      questionType: 'true-false',
      correctAnswer: q.correctAnswer,
      points: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15,
      timeLimit: q.estimatedTime || 30,
      difficulty,
      category,
      tags: [...(q.tags || []), 'ai-generated', topic],
      aiGenerated: {
        isAIGenerated: true,
        aiSource: 'gpt-oss',
        generationDate: new Date(),
        topic,
        confidence: 0.95,
        explanation: q.explanation
      },
      createdBy: req.user.id
    }));

    if (saveToBank) {
      const savedQuestions = await Question.insertMany(questions);
      
      await logAudit({
        userId: req.user.id,
        action: 'AI_GENERATE_QUESTIONS',
        resource: 'Question',
        details: {
          topic,
          difficulty,
          count: savedQuestions.length,
          type: 'true-false'
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      return res.status(201).json({
        success: true,
        message: `Generated and saved ${savedQuestions.length} questions`,
        questions: savedQuestions
      });
    }

    res.json({
      success: true,
      message: `Generated ${questions.length} questions`,
      questions
    });

  } catch (error) {
    console.error('Error generating true/false questions:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate questions'
    });
  }
};

/**
 * Generate coding questions
 */
exports.generateCoding = async (req, res) => {
  try {
    const { topic, customPrompt, language = 'javascript', difficulty = 'medium', count = 1, saveToBank = false, category = 'AI-Generated' } = req.body;

    // Validate: either topic or customPrompt must be provided
    if (!topic && !customPrompt) {
      return res.status(400).json({ error: 'Either topic or custom prompt is required' });
    }

    if (count < 1 || count > 10) {
      return res.status(400).json({ error: 'Count must be between 1 and 10' });
    }

    const effectiveTopic = topic || 'Custom Topic';
    const generatedQuestions = await aiService.generateCodingQuestion(effectiveTopic, language, difficulty, count, customPrompt);

    const questions = generatedQuestions.map(q => ({
      questionText: q.questionText,
      questionType: 'code',
      codeLanguage: language,
      starterCode: q.starterCode,
      solution: q.solution,
      testCases: q.testCases,
      hints: q.hints || [],
      points: q.points || 30,
      timeLimit: q.estimatedTime || 900,
      difficulty,
      category,
      tags: [...(q.tags || []), 'ai-generated', topic, language],
      aiGenerated: {
        isAIGenerated: true,
        aiSource: 'gpt-oss',
        generationDate: new Date(),
        topic,
        confidence: 0.90,
        language
      },
      createdBy: req.user.id
    }));

    if (saveToBank) {
      const savedQuestions = await Question.insertMany(questions);
      
      await logAudit({
        userId: req.user.id,
        action: 'AI_GENERATE_QUESTIONS',
        resource: 'Question',
        details: {
          topic,
          language,
          difficulty,
          count: savedQuestions.length,
          type: 'code'
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      return res.status(201).json({
        success: true,
        message: `Generated and saved ${savedQuestions.length} questions`,
        questions: savedQuestions
      });
    }

    res.json({
      success: true,
      message: `Generated ${questions.length} questions`,
      questions
    });

  } catch (error) {
    console.error('Error generating coding questions:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate questions'
    });
  }
};

/**
 * Generate fill-in-the-blank questions
 */
exports.generateFillInBlank = async (req, res) => {
  try {
    const { topic, customPrompt, difficulty = 'medium', count = 1, saveToBank = false, category = 'AI-Generated', language = 'javascript' } = req.body;

    // Validate: either topic or customPrompt must be provided
    if (!topic && !customPrompt) {
      return res.status(400).json({ error: 'Either topic or custom prompt is required' });
    }

    if (count < 1 || count > 20) {
      return res.status(400).json({ error: 'Count must be between 1 and 20' });
    }

    const effectiveTopic = topic || 'Custom Topic';
    // Generate questions using Ollama AI
    const questions = await aiService.generateFillInBlank(effectiveTopic, difficulty, count, customPrompt);

    // Add metadata and normalize
    const normalizedQuestions = questions.map((q, index) => ({
      ...q,
      questionType: 'fill-in-the-blank',
      blankAnswers: q.blankAnswers || [q.correctAnswer] || [''],
      caseSensitive: q.caseSensitive !== undefined ? q.caseSensitive : false,
      partialCredit: true,
      maxScore: 1,
      points: 10,
      category: category,
      language: language,
      _id: `ai-fb-${Date.now()}-${index}`,
      generatedAt: new Date().toISOString()
    }));

    // Optionally save to question bank
    if (saveToBank) {
      try {
        const savedQuestions = await Question.insertMany(normalizedQuestions);
        await logAudit(req.user._id, 'create_questions_ai', {
          count: savedQuestions.length,
          topic,
          difficulty,
          category,
          questionType: 'fill-in-the-blank'
        });
      } catch (saveError) {
        console.error('Error saving to question bank:', saveError);
      }
    }

    res.json({
      success: true,
      message: `Generated ${questions.length} questions`,
      questions: normalizedQuestions
    });

  } catch (error) {
    console.error('Error generating fill-in-blank questions:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate questions'
    });
  }
};

/**
 * Generate essay questions
 */
exports.generateEssay = async (req, res) => {
  try {
    const { topic, difficulty = 'medium', count = 1, saveToBank = false, category = 'AI-Generated' } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (count < 1 || count > 10) {
      return res.status(400).json({ error: 'Count must be between 1 and 10' });
    }

    const generatedQuestions = await aiService.generateEssayQuestion(topic, difficulty, count);

    const questions = generatedQuestions.map(q => ({
      questionText: q.questionText,
      questionType: 'essay',
      rubric: q.rubric,
      keyPoints: q.keyPoints,
      wordCount: q.wordCount,
      points: q.rubric.reduce((sum, r) => sum + r.points, 0),
      timeLimit: q.estimatedTime || 1200,
      difficulty,
      category,
      tags: [...(q.tags || []), 'ai-generated', topic],
      aiGenerated: {
        isAIGenerated: true,
        aiSource: 'gpt-oss',
        generationDate: new Date(),
        topic,
        confidence: 0.85,
        rubric: q.rubric
      },
      createdBy: req.user.id
    }));

    if (saveToBank) {
      const savedQuestions = await Question.insertMany(questions);
      
      await logAudit({
        userId: req.user.id,
        action: 'AI_GENERATE_QUESTIONS',
        resource: 'Question',
        details: {
          topic,
          difficulty,
          count: savedQuestions.length,
          type: 'essay'
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      return res.status(201).json({
        success: true,
        message: `Generated and saved ${savedQuestions.length} questions`,
        questions: savedQuestions
      });
    }

    res.json({
      success: true,
      message: `Generated ${questions.length} questions`,
      questions
    });

  } catch (error) {
    console.error('Error generating essay questions:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate questions'
    });
  }
};

/**
 * Generate mixed question types
 */
exports.generateMixed = async (req, res) => {
  try {
    const { 
      topic, 
      customPrompt,
      difficulty = 'medium',
      count = 5, // User-requested total question count
      distribution, // Optional: user can specify exact distribution
      saveToBank = false,
      category = 'AI-Generated'
    } = req.body;

    // Validate: either topic or custom prompt must be provided
    if (!topic && !customPrompt) {
      return res.status(400).json({ error: 'Topic or custom prompt is required' });
    }

    // If user provides specific distribution, use it
    // Otherwise, create a balanced distribution based on the count
    let finalDistribution = distribution;
    
    if (!distribution) {
      // Auto-calculate distribution based on requested count
      // Prioritize: MCQ, T/F, Coding, Fill-in-blank
      const requestedCount = parseInt(count) || 5;
      
      if (requestedCount <= 2) {
        finalDistribution = { multipleChoice: requestedCount, trueFalse: 0, coding: 0, sql: 0, essay: 0 };
      } else if (requestedCount <= 4) {
        const mcq = Math.ceil(requestedCount * 0.5);
        const tf = requestedCount - mcq;
        finalDistribution = { multipleChoice: mcq, trueFalse: tf, coding: 0, sql: 0, essay: 0 };
      } else {
        // For 5+ questions, distribute across types
        const mcq = Math.ceil(requestedCount * 0.4); // 40% MCQ
        const tf = Math.floor(requestedCount * 0.3); // 30% T/F
        const code = Math.floor(requestedCount * 0.2); // 20% Coding
        const remaining = requestedCount - (mcq + tf + code);
        finalDistribution = { 
          multipleChoice: mcq, 
          trueFalse: tf, 
          coding: code,
          fillInBlank: remaining,
          sql: 0, 
          essay: 0 
        };
      }
      
      console.log(`Mixed questions: User requested ${requestedCount} total. Using distribution:`, finalDistribution);
    }

    const effectiveTopic = topic || 'Custom Topic';
    const results = await aiService.generateMixedQuestions(effectiveTopic, difficulty, finalDistribution, customPrompt);

    const allQuestions = [];

    // Transform multiple choice questions
    results.multipleChoice.forEach(q => {
      allQuestions.push({
        questionText: q.questionText,
        questionType: 'multiple-choice',
        options: q.options,
        correctAnswer: q.options[q.correctAnswer.charCodeAt(0) - 65] || q.options[0], // Return string, not array
        points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30,
        timeLimit: q.estimatedTime || 60,
        difficulty,
        category,
        tags: [...(q.tags || []), 'ai-generated', topic],
        aiGenerated: {
          isAIGenerated: true,
          aiSource: 'gpt-oss',
          generationDate: new Date(),
          topic,
          confidence: 0.95
        },
        createdBy: req.user.id
      });
    });

    // Transform true/false questions
    results.trueFalse.forEach(q => {
      allQuestions.push({
        questionText: q.questionText,
        questionType: 'true-false',
        correctAnswer: q.correctAnswer,
        points: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15,
        timeLimit: q.estimatedTime || 30,
        difficulty,
        category,
        tags: [...(q.tags || []), 'ai-generated', topic],
        aiGenerated: {
          isAIGenerated: true,
          aiSource: 'gpt-oss',
          generationDate: new Date(),
          topic,
          confidence: 0.95
        },
        createdBy: req.user.id
      });
    });

    // Transform coding questions
    results.coding.forEach(q => {
      allQuestions.push({
        questionText: q.questionText,
        questionType: 'code',
        codeLanguage: q.language,
        starterCode: q.starterCode,
        solution: q.solution,
        testCases: q.testCases,
        points: q.points || 30,
        timeLimit: q.estimatedTime || 900,
        difficulty,
        category,
        tags: [...(q.tags || []), 'ai-generated', topic],
        aiGenerated: {
          isAIGenerated: true,
          aiSource: 'gpt-oss',
          generationDate: new Date(),
          topic,
          confidence: 0.90
        },
        createdBy: req.user.id
      });
    });

    // Transform fill-in-blank questions
    if (results.fillInBlank && results.fillInBlank.length > 0) {
      results.fillInBlank.forEach(q => {
        allQuestions.push({
          questionText: q.questionText,
          questionType: 'fill-in-the-blank',
          blankAnswers: q.blankAnswers || [],
          caseSensitive: q.caseSensitive || false,
          points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20,
          timeLimit: q.estimatedTime || 60,
          difficulty,
          category,
          tags: [...(q.tags || []), 'ai-generated', topic],
          aiGenerated: {
            isAIGenerated: true,
            aiSource: 'ollama-qwen2.5-coder',
            generationDate: new Date(),
            topic,
            confidence: 0.90
          },
          createdBy: req.user.id
        });
      });
    }

    // Transform essay questions
    if (results.essay && results.essay.length > 0) {
      results.essay.forEach(q => {
        allQuestions.push({
          questionText: q.questionText,
          questionType: 'essay',
          rubric: q.rubric || [],
          keyPoints: q.keyPoints || [],
          points: (q.rubric && q.rubric.length > 0) ? q.rubric.reduce((sum, r) => sum + r.points, 0) : 30,
          timeLimit: q.estimatedTime || 1200,
          difficulty,
          category,
          tags: [...(q.tags || []), 'ai-generated', topic],
          aiGenerated: {
            isAIGenerated: true,
            aiSource: 'ollama-qwen2.5-coder',
            generationDate: new Date(),
            topic,
            confidence: 0.85
          },
          createdBy: req.user.id
        });
      });
    }

    // Transform SQL questions
    if (results.sql && results.sql.length > 0) {
      results.sql.forEach(q => {
        allQuestions.push({
          questionText: q.questionText,
          questionType: 'sql',
          correctQuery: q.correctQuery,
          schemaDescription: q.schemaDescription,
          sampleData: q.sampleData,
          points: difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : 40,
          timeLimit: q.estimatedTime || 600,
          difficulty,
          category,
          tags: [...(q.tags || []), 'ai-generated', 'sql', topic],
          aiGenerated: {
            isAIGenerated: true,
            aiSource: 'ollama-qwen2.5-coder',
            generationDate: new Date(),
            topic,
            confidence: 0.90,
            explanation: q.explanation
          },
          createdBy: req.user.id
        });
      });
    }

    if (saveToBank) {
      const savedQuestions = await Question.insertMany(allQuestions);
      
      await logAudit({
        userId: req.user.id,
        action: 'AI_GENERATE_QUESTIONS',
        resource: 'Question',
        details: {
          topic,
          difficulty,
          count: savedQuestions.length,
          type: 'mixed',
          distribution: results
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      return res.status(201).json({
        success: true,
        message: `Generated and saved ${savedQuestions.length} mixed questions`,
        questions: savedQuestions,
        breakdown: {
          multipleChoice: results.multipleChoice.length,
          trueFalse: results.trueFalse.length,
          coding: results.coding.length,
          essay: results.essay.length
        }
      });
    }

    res.json({
      success: true,
      message: `Generated ${allQuestions.length} mixed questions`,
      questions: allQuestions,
      breakdown: {
        multipleChoice: results.multipleChoice.length,
        trueFalse: results.trueFalse.length,
        coding: results.coding.length,
        essay: results.essay.length
      }
    });

  } catch (error) {
    console.error('Error generating mixed questions:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate questions'
    });
  }
};

/**
 * Improve existing question
 */
exports.improveQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({ error: 'Feedback is required' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const improvement = await aiService.improveQuestion(
      question.questionText,
      question.questionType,
      feedback
    );

    res.json({
      success: true,
      original: question.questionText,
      improved: improvement.improvedQuestionText,
      changes: improvement.changes,
      reasoning: improvement.reasoning
    });

  } catch (error) {
    console.error('Error improving question:', error);
    res.status(500).json({ 
      error: 'Failed to improve question', 
      details: error.message 
    });
  }
};

/**
 * Validate question quality
 */
exports.validateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const validation = await aiService.validateQuestion(
      question.questionText,
      question.questionType
    );

    res.json({
      success: true,
      questionId,
      validation
    });

  } catch (error) {
    console.error('Error validating question:', error);
    res.status(500).json({ 
      error: 'Failed to validate question', 
      details: error.message 
    });
  }
};

/**
 * Get AI generation statistics
 */
exports.getAIStats = async (req, res) => {
  try {
    const stats = await Question.aggregate([
      {
        $match: {
          'aiGenerated.isAIGenerated': true,
          createdBy: req.user.id
        }
      },
      {
        $group: {
          _id: {
            type: '$questionType',
            difficulty: '$difficulty',
            source: '$aiGenerated.aiSource'
          },
          count: { $sum: 1 },
          avgConfidence: { $avg: '$aiGenerated.confidence' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const totalAIGenerated = await Question.countDocuments({
      'aiGenerated.isAIGenerated': true,
      createdBy: req.user.id
    });

    res.json({
      success: true,
      totalAIGenerated,
      breakdown: stats
    });

  } catch (error) {
    console.error('Error getting AI stats:', error);
    res.status(500).json({ 
      error: 'Failed to get AI statistics', 
      details: error.message 
    });
  }
};

module.exports = exports;
