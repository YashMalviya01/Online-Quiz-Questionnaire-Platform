const fs = require('fs');
const path = require('path');

/**
 * Question Bank Service
 * Provides random question generation from a pre-built question bank
 * Replaces AI-based generation with topic-based selection
 */

class QuestionBankService {
  constructor() {
    this.questionBank = null;
    this.loadQuestionBank();
  }

  /**
   * Load question bank from JSON file
   */
  loadQuestionBank() {
    try {
      const bankPath = path.join(__dirname, '../data/questionBankGenerated.json');
      const data = fs.readFileSync(bankPath, 'utf8');
      this.questionBank = JSON.parse(data);
      console.log('✓ Question bank loaded successfully');
      console.log(`  Languages: ${Object.keys(this.questionBank).join(', ')}`);
      const totalQuestions = Object.values(this.questionBank).reduce((sum, questions) => sum + questions.length, 0);
      console.log(`  Total questions: ${totalQuestions}`);
    } catch (error) {
      console.error('Error loading question bank:', error.message);
      this.questionBank = {};
    }
  }

  /**
   * Check if service is available
   */
  async isAvailable() {
    return this.questionBank && Object.keys(this.questionBank).length > 0;
  }

  /**
   * Get available languages
   */
  getAvailableLanguages() {
    return Object.keys(this.questionBank || {});
  }

  /**
   * Get available topics for a language
   */
  getAvailableTopics(language) {
    const questions = this.questionBank[language.toLowerCase()] || [];
    const topics = [...new Set(questions.map(q => q.topic).filter(Boolean))];
    return topics;
  }

  /**
   * Filter questions by topic keywords
   */
  filterByTopic(questions, topic) {
    if (!topic || topic.trim() === '' || topic === 'null' || topic === 'undefined') {
      return questions;
    }

    // Sanitize topic: remove special characters but keep alphanumeric, spaces, hyphens, and +
    const sanitizedTopic = String(topic).replace(/[^a-zA-Z0-9\s\-+]/g, '').trim();
    
    if (sanitizedTopic === '') {
      return questions;
    }

    const topicLower = sanitizedTopic.toLowerCase();

    return questions.filter(q => {
      const questionTopic = (q.topic || '').toLowerCase();
      const tags = (q.tags || []).map(t => t.toLowerCase());

      // Priority 1: Exact match with question topic
      if (questionTopic === topicLower) {
        return true;
      }

      // Priority 2: Question topic contains the full search topic
      if (questionTopic.includes(topicLower)) {
        return true;
      }

      // Priority 3: Search topic contains the full question topic (for shorter topics)
      if (topicLower.includes(questionTopic) && questionTopic.length > 5) {
        return true;
      }

      // Priority 4: Check if any tag exactly matches
      if (tags.some(tag => tag === topicLower)) {
        return true;
      }

      // Priority 5: Tag contains the search topic
      if (tags.some(tag => tag.includes(topicLower))) {
        return true;
      }

      // Only use keyword matching as last resort and require multiple keyword matches
      const keywords = topicLower.split(' ').filter(k => k.length > 3); // Increase min length to 4
      if (keywords.length > 0) {
        const questionText = (q.questionText || '').toLowerCase();
        
        // Require at least 2 keywords to match for broad topics
        const matchCount = keywords.filter(keyword => 
          questionTopic.includes(keyword) || 
          tags.some(tag => tag.includes(keyword)) ||
          questionText.includes(keyword)
        ).length;

        // Require majority of keywords to match
        return matchCount >= Math.ceil(keywords.length * 0.6);
      }

      return false;
    });
  }

  /**
   * Filter questions by difficulty
   */
  filterByDifficulty(questions, difficulty) {
    if (!difficulty || difficulty === 'any') {
      return questions;
    }
    return questions.filter(q => q.difficulty === difficulty);
  }

  /**
   * Filter questions by type
   */
  filterByType(questions, questionType) {
    if (!questionType || questionType === 'mixed') {
      return questions;
    }
    return questions.filter(q => q.questionType === questionType);
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Generate multiple choice questions
   */
  async generateMultipleChoice(options) {
    const { topic, difficulty = 'medium', count = 5, language = 'javascript' } = options;

    // Validate count
    if (count <= 0) {
      throw new Error('Question count must be greater than 0');
    }

    if (count > 50) {
      throw new Error('Question count cannot exceed 50 per request');
    }

    // Get questions for the language
    let questions = this.questionBank[language.toLowerCase()] || [];
    const totalQuestions = questions.length;
    
    if (questions.length === 0) {
      throw new Error(`No questions available for language: ${language}`);
    }

    // Filter by topic
    questions = this.filterByTopic(questions, topic);
    const afterTopicFilter = questions.length;
    
    if (questions.length === 0) {
      throw new Error(`No questions found for topic: ${topic}`);
    }

    // Filter by type
    questions = questions.filter(q => q.questionType === 'multiple-choice');
    const afterTypeFilter = questions.length;

    // Filter by difficulty (but keep some questions even if not enough at requested difficulty)
    const difficultyFiltered = this.filterByDifficulty(questions, difficulty);
    const afterDifficultyFilter = difficultyFiltered.length;

    // If we don't have enough questions at requested difficulty, include all difficulties
    if (difficultyFiltered.length < count) {
      console.log(`Not enough questions at "${difficulty}" difficulty (${difficultyFiltered.length}), including all difficulty levels`);
      // Keep all questions regardless of difficulty
    } else {
      questions = difficultyFiltered;
    }

    console.log(`Question filtering for "${topic}" (${language}):`, {
      total: totalQuestions,
      afterTopic: afterTopicFilter,
      afterType: afterTypeFilter,
      afterDifficulty: afterDifficultyFilter,
      finalPool: questions.length,
      requested: count
    });

    // Shuffle and select
    questions = this.shuffleArray(questions);
    const selected = questions.slice(0, Math.min(count, questions.length));

    // Validate and ensure each question has required fields
    return selected
      .filter(q => {
        // Validate required fields
        if (!q.questionText || q.questionText.trim() === '') {
          console.warn('Skipping question with missing questionText');
          return false;
        }
        if (!Array.isArray(q.options) || q.options.length === 0) {
          console.warn('Skipping question with missing options:', q.questionText);
          return false;
        }
        return true;
      })
      .map((q, index) => {
        // Convert correctAnswer from text to index if needed
        let correctAnswerText = q.correctAnswer;
        if (typeof q.correctAnswer === 'number' && q.options) {
          correctAnswerText = q.options[q.correctAnswer];
        }
        
        // Shuffle options to randomize correct answer position
        let shuffledOptions = [...q.options];
        let correctAnswerIndex = shuffledOptions.findIndex(opt => opt === correctAnswerText);
        
        // Only shuffle if we have options
        if (shuffledOptions.length > 1) {
          // Fisher-Yates shuffle
          for (let i = shuffledOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
          }
          // Find new position of correct answer after shuffle
          correctAnswerIndex = shuffledOptions.findIndex(opt => opt === correctAnswerText);
        }
        
        // Ensure all required fields are present
        return {
          questionText: q.questionText,
          questionType: q.questionType || 'multiple-choice',
          options: shuffledOptions,
          correctAnswer: correctAnswerIndex,
          difficulty: q.difficulty || 'medium',
          topic: q.topic || topic,
          tags: q.tags || [language, topic],
          category: q.category || 'Programming',
          maxScore: q.maxScore || 1,
          points: q.points || 10,
          _id: `${language}-mc-${Date.now()}-${index}`,
          generatedAt: new Date().toISOString()
        };
      });
  }

  /**
   * Generate true/false questions
   */
  async generateTrueFalse(options) {
    const { topic, difficulty = 'medium', count = 5, language = 'javascript' } = options;

    // Validate count
    if (count <= 0) {
      throw new Error('Question count must be greater than 0');
    }

    if (count > 50) {
      throw new Error('Question count cannot exceed 50 per request');
    }

    let questions = this.questionBank[language.toLowerCase()] || [];
    
    if (questions.length === 0) {
      throw new Error(`No questions available for language: ${language}`);
    }

    // Filter by topic
    questions = this.filterByTopic(questions, topic);

    // Filter by type
    questions = questions.filter(q => q.questionType === 'true-false');

    // Filter by difficulty
    questions = this.filterByDifficulty(questions, difficulty);

    // Shuffle and select
    questions = this.shuffleArray(questions);
    const selected = questions.slice(0, Math.min(count, questions.length));

    return selected
      .filter(q => q.questionText && q.questionText.trim() !== '')
      .map((q, index) => ({
        questionText: q.questionText,
        questionType: q.questionType || 'true-false',
        options: q.options || ['True', 'False'],
        correctAnswer: q.correctAnswer || 'True',
        difficulty: q.difficulty || 'medium',
        topic: q.topic || topic,
        tags: q.tags || [language, topic],
        category: q.category || 'Programming',
        maxScore: q.maxScore || 1,
        points: q.points || 10,
        _id: `${language}-tf-${Date.now()}-${index}`,
        generatedAt: new Date().toISOString()
      }));
  }

  /**
   * Generate fill in the blank questions
   */
  async generateFillInTheBlank(options) {
    const { topic, difficulty = 'medium', count = 5, language = 'javascript' } = options;

    // Validate count
    if (count <= 0) {
      throw new Error('Question count must be greater than 0');
    }

    if (count > 50) {
      throw new Error('Question count cannot exceed 50 per request');
    }

    let questions = this.questionBank[language.toLowerCase()] || [];
    
    if (questions.length === 0) {
      throw new Error(`No questions available for language: ${language}`);
    }

    // Filter by topic
    questions = this.filterByTopic(questions, topic);

    // Filter by type
    questions = questions.filter(q => q.questionType === 'fill-in-the-blank');

    // Filter by difficulty
    questions = this.filterByDifficulty(questions, difficulty);

    // Shuffle and select
    questions = this.shuffleArray(questions);
    const selected = questions.slice(0, Math.min(count, questions.length));

    return selected
      .filter(q => q.questionText && q.questionText.trim() !== '')
      .map((q, index) => ({
        questionText: q.questionText,
        questionType: q.questionType || 'fill-in-the-blank',
        blankAnswers: q.blankAnswers || q.correctAnswer ? [q.correctAnswer] : [''],
        caseSensitive: q.caseSensitive !== undefined ? q.caseSensitive : false,
        difficulty: q.difficulty || 'medium',
        topic: q.topic || topic,
        tags: q.tags || [language, topic],
        category: q.category || 'Programming',
        maxScore: q.maxScore || 1,
        points: q.points || 10,
        _id: `${language}-fb-${Date.now()}-${index}`,
        generatedAt: new Date().toISOString()
      }));
  }

  /**
   * Generate mixed type questions
   */
  async generateMixed(options) {
    const { topic, difficulty = 'medium', count = 10, language = 'javascript' } = options;

    // Validate count
    if (count <= 0) {
      throw new Error('Question count must be greater than 0');
    }

    if (count > 50) {
      throw new Error('Question count cannot exceed 50 per request');
    }

    let questions = this.questionBank[language.toLowerCase()] || [];
    
    if (questions.length === 0) {
      throw new Error(`No questions available for language: ${language}`);
    }

    // Filter by topic
    questions = this.filterByTopic(questions, topic);

    if (questions.length === 0) {
      throw new Error(`No questions found for topic: ${topic}`);
    }

    // Filter by difficulty
    questions = this.filterByDifficulty(questions, difficulty);

    // Shuffle and select
    questions = this.shuffleArray(questions);
    const selected = questions.slice(0, Math.min(count, questions.length));

    return selected
      .filter(q => q.questionText && q.questionText.trim() !== '')
      .map((q, index) => {
        // Process each question based on its type
        const baseQuestion = {
          questionText: q.questionText,
          questionType: q.questionType || 'multiple-choice',
          difficulty: q.difficulty || 'medium',
          topic: q.topic || topic,
          tags: q.tags || [language, topic],
          category: q.category || 'Programming',
          maxScore: q.maxScore || 1,
          points: q.points || 10,
          _id: `${language}-mixed-${Date.now()}-${index}`,
          generatedAt: new Date().toISOString()
        };

        // Add type-specific fields
        if (q.questionType === 'multiple-choice') {
          if (Array.isArray(q.options) && q.options.length > 0) {
            // Convert correctAnswer to index and shuffle options
            let correctAnswerText = typeof q.correctAnswer === 'number' && q.options ? q.options[q.correctAnswer] : q.correctAnswer;
            let shuffledOptions = [...q.options];
            
            if (shuffledOptions.length > 1) {
              for (let i = shuffledOptions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
              }
            }
            
            const correctAnswerIndex = shuffledOptions.findIndex(opt => opt === correctAnswerText);
            baseQuestion.options = shuffledOptions;
            baseQuestion.correctAnswer = correctAnswerIndex;
          }
        } else if (q.questionType === 'true-false') {
          baseQuestion.options = q.options || ['True', 'False'];
          baseQuestion.correctAnswer = q.correctAnswer || 'True';
        } else if (q.questionType === 'fill-in-the-blank') {
          baseQuestion.blankAnswers = q.blankAnswers || (q.correctAnswer ? [q.correctAnswer] : ['']);
          baseQuestion.caseSensitive = q.caseSensitive !== undefined ? q.caseSensitive : false;
        }

        return baseQuestion;
      });
  }

  /**
   * Generate coding questions (template-based)
   */
  async generateCoding(options) {
    const { topic, difficulty = 'medium', count = 3, language = 'javascript' } = options;

    // Validate count
    if (count <= 0) {
      throw new Error('Question count must be greater than 0');
    }

    if (count > 20) {
      throw new Error('Coding question count cannot exceed 20 per request');
    }

    // Coding question templates by language
    const codingTemplates = {
      javascript: [
        {
          questionText: `Write a function that ${topic.toLowerCase()}`,
          codeLanguage: 'javascript',
          starterCode: '// Write your solution here\nfunction solution() {\n  \n}',
          referenceSolution: '// Solution will be evaluated based on test cases',
          evaluationNotes: `Test cases will verify ${topic} functionality`,
        }
      ],
      python: [
        {
          questionText: `Implement a function that ${topic.toLowerCase()}`,
          codeLanguage: 'python',
          starterCode: '# Write your solution here\ndef solution():\n    pass',
          referenceSolution: '# Solution will be evaluated based on test cases',
          evaluationNotes: `Test cases will verify ${topic} functionality`,
        }
      ],
      java: [
        {
          questionText: `Create a method that ${topic.toLowerCase()}`,
          codeLanguage: 'java',
          starterCode: '// Write your solution here\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}',
          referenceSolution: '// Solution will be evaluated based on test cases',
          evaluationNotes: `Test cases will verify ${topic} functionality`,
        }
      ],
      cpp: [
        {
          questionText: `Implement a function that ${topic.toLowerCase()}`,
          codeLanguage: 'cpp',
          starterCode: '// Write your solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
          referenceSolution: '// Solution will be evaluated based on test cases',
          evaluationNotes: `Test cases will verify ${topic} functionality`,
        }
      ]
    };

    const templates = codingTemplates[language.toLowerCase()] || codingTemplates.javascript;
    const questions = [];

    for (let i = 0; i < Math.min(count, templates.length * 3); i++) {
      const template = templates[i % templates.length];
      questions.push({
        ...template,
        _id: `${language}-code-${Date.now()}-${i}`,
        questionType: 'code',
        maxScore: 10,
        difficulty,
        category: 'Programming',
        topic,
        tags: [language, topic, 'coding'],
        generatedAt: new Date().toISOString()
      });
    }

    return questions;
  }
}

// Export singleton instance
module.exports = new QuestionBankService();
