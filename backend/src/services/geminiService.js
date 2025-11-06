const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Google Gemini AI Service for Quiz Generation
 * Automatically generates quiz questions using Gemini AI API
 */

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.model = null;
    this.generationConfig = {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 4096,
    };
    this.requestOptions = {
      timeout: 120000, // 120 seconds for complex generations
    };
    
    if (this.apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(this.apiKey);
        // Use gemini-1.5-flash - faster and more available model
        this.model = genAI.getGenerativeModel({ 
          model: 'gemini-1.5-flash',
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        });
        console.log('✓ Gemini AI service initialized successfully with gemini-1.5-flash');
      } catch (error) {
        console.error('✗ Failed to initialize Gemini AI:', error);
      }
    } else {
      console.warn('⚠ GEMINI_API_KEY not found in environment variables');
    }
  }

  /**
   * Check if Gemini service is available
   */
  isAvailable() {
    return this.model !== null;
  }

  /**
   * Retry logic with exponential backoff for API calls
   */
  async retryWithBackoff(fn, maxRetries = 5, initialDelay = 2000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        const isLastAttempt = attempt === maxRetries;
        const isRetryableError = error.message?.includes('503') || 
                                  error.message?.includes('overloaded') ||
                                  error.message?.includes('429') ||
                                  error.message?.includes('rate limit') ||
                                  error.message?.includes('Service Unavailable');
        
        if (!isRetryableError || isLastAttempt) {
          throw error;
        }
        
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.log(`⏳ Retry ${attempt}/${maxRetries} in ${delay}ms - API overloaded`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Parse JSON from Gemini response with multiple fallback methods
   */
  parseGeminiJSON(text, context = '') {
    console.log(`Parsing Gemini response for ${context}:`, text.substring(0, 300));
    
    // Method 1: Look for JSON array in raw text
    let jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        const result = JSON.parse(jsonMatch[0]);
        if (Array.isArray(result)) return result;
      } catch (e) {
        console.log('Method 1 (raw array) failed:', e.message);
      }
    }
    
    // Method 2: Remove markdown code blocks and try again
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        const result = JSON.parse(jsonMatch[0]);
        if (Array.isArray(result)) return result;
      } catch (e) {
        console.log('Method 2 (cleaned array) failed:', e.message);
      }
    }
    
    // Method 3: Try parsing entire cleaned text
    try {
      const result = JSON.parse(cleanedText);
      if (Array.isArray(result)) return result;
      if (result && Array.isArray(result.questions)) return result.questions;
    } catch (e) {
      console.log('Method 3 (full parse) failed:', e.message);
    }
    
    console.error('All JSON parsing methods failed. Raw text:', text);
    throw new Error('Failed to parse JSON response from Gemini');
  }

  /**
   * Generate multiple choice questions
   */
  async generateMultipleChoiceQuestion(topic, difficulty = 'medium', count = 1) {
    if (!this.isAvailable()) {
      throw new Error('Gemini AI service is not available. Please configure GEMINI_API_KEY.');
    }

    const difficultyInstructions = {
      easy: 'basic understanding and recall',
      medium: 'application and analysis',
      hard: 'complex problem-solving and synthesis'
    };

    const prompt = `Generate ${count} multiple-choice question${count > 1 ? 's' : ''} about "${topic}" at ${difficulty} difficulty level (${difficultyInstructions[difficulty]}).

For each question, provide:
1. A clear, specific question text
2. Exactly 4 options (labeled A, B, C, D)
3. The correct answer (letter only)
4. A brief explanation of why the answer is correct
5. Estimated time to answer in seconds (15-90 seconds)

Format the response as a JSON array with this structure:
[
  {
    "questionText": "string",
    "options": ["option A", "option B", "option C", "option D"],
    "correctAnswer": "A",
    "explanation": "string",
    "estimatedTime": 30,
    "tags": ["tag1", "tag2"]
  }
]

Requirements:
- Questions should test understanding, not just memorization
- Options should be plausible and mutually exclusive
- Avoid "all of the above" or "none of the above" options
- Use technical accuracy and current best practices
- Include relevant tags for categorization

Return ONLY the JSON array, no additional text.`;

    try {
      const result = await this.retryWithBackoff(async () => {
        return await this.model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
        });
      });
      
      const response = result.response;
      const text = response.text();
      
      const questions = this.parseGeminiJSON(text, 'multiple-choice');
      
      console.log(`✓ Generated ${questions.length} multiple-choice questions on topic: ${topic}`);
      return questions;
      
    } catch (error) {
      console.error('Error generating multiple-choice questions:', error);
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
  }

  /**
   * Generate true/false questions
   */
  async generateTrueFalseQuestion(topic, difficulty = 'medium', count = 1) {
    if (!this.isAvailable()) {
      throw new Error('Gemini AI service is not available. Please configure GEMINI_API_KEY.');
    }

    const prompt = `Generate ${count} true/false question${count > 1 ? 's' : ''} about "${topic}" at ${difficulty} difficulty level.

For each question, provide:
1. A clear statement that is definitively true or false
2. The correct answer (true or false)
3. A brief explanation
4. Estimated time to answer in seconds (10-30 seconds)

Format as JSON:
[
  {
    "questionText": "string",
    "correctAnswer": true,
    "explanation": "string",
    "estimatedTime": 15,
    "tags": ["tag1", "tag2"]
  }
]

Requirements:
- Statements should be clear and unambiguous
- Avoid trick questions or double negatives
- Test conceptual understanding

Return ONLY the JSON array.`;

    try {
      const result = await this.retryWithBackoff(async () => {
        return await this.model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
        });
      });
      
      const response = result.response;
      const text = response.text();
      
      const questions = this.parseGeminiJSON(text, 'true-false');
      
      console.log(`✓ Generated ${questions.length} true/false questions on topic: ${topic}`);
      return questions;
      
    } catch (error) {
      console.error('Error generating true/false questions:', error);
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
  }

  /**
   * Generate coding questions
   */
  async generateCodingQuestion(topic, language, difficulty = 'medium', count = 1) {
    if (!this.isAvailable()) {
      throw new Error('Gemini AI service is not available. Please configure GEMINI_API_KEY.');
    }

    const points = { easy: 15, medium: 30, hard: 50 };
    
    // Create language-appropriate code examples for all supported languages
    const examples = {
      javascript: {
        starter: 'function solve(input) {\n  // Write your code here\n  return result;\n}',
        solution: 'function solve(input) {\n  return input * 2;\n}'
      },
      python: {
        starter: 'def solve(input):\n    # Write your code here\n    pass',
        solution: 'def solve(input):\n    return input * 2'
      },
      java: {
        starter: 'public static int solve(int input) {\n    // Write your code here\n    return 0;\n}',
        solution: 'public static int solve(int input) {\n    return input * 2;\n}'
      },
      cpp: {
        starter: 'int solve(int input) {\n    // Write your code here\n    return 0;\n}',
        solution: 'int solve(int input) {\n    return input * 2;\n}'
      },
      'c++': {
        starter: 'int solve(int input) {\n    // Write your code here\n    return 0;\n}',
        solution: 'int solve(int input) {\n    return input * 2;\n}'
      },
      c: {
        starter: 'int solve(int input) {\n    // Write your code here\n    return 0;\n}',
        solution: 'int solve(int input) {\n    return input * 2;\n}'
      },
      'c#': {
        starter: 'public static int Solve(int input) {\n    // Write your code here\n    return 0;\n}',
        solution: 'public static int Solve(int input) {\n    return input * 2;\n}'
      },
      csharp: {
        starter: 'public static int Solve(int input) {\n    // Write your code here\n    return 0;\n}',
        solution: 'public static int Solve(int input) {\n    return input * 2;\n}'
      },
      typescript: {
        starter: 'function solve(input: number): number {\n  // Write your code here\n  return 0;\n}',
        solution: 'function solve(input: number): number {\n  return input * 2;\n}'
      },
      go: {
        starter: 'func solve(input int) int {\n    // Write your code here\n    return 0\n}',
        solution: 'func solve(input int) int {\n    return input * 2\n}'
      },
      golang: {
        starter: 'func solve(input int) int {\n    // Write your code here\n    return 0\n}',
        solution: 'func solve(input int) int {\n    return input * 2\n}'
      },
      ruby: {
        starter: 'def solve(input)\n  # Write your code here\n  0\nend',
        solution: 'def solve(input)\n  input * 2\nend'
      },
      php: {
        starter: 'function solve($input) {\n    // Write your code here\n    return 0;\n}',
        solution: 'function solve($input) {\n    return $input * 2;\n}'
      },
      swift: {
        starter: 'func solve(_ input: Int) -> Int {\n    // Write your code here\n    return 0\n}',
        solution: 'func solve(_ input: Int) -> Int {\n    return input * 2\n}'
      },
      kotlin: {
        starter: 'fun solve(input: Int): Int {\n    // Write your code here\n    return 0\n}',
        solution: 'fun solve(input: Int): Int {\n    return input * 2\n}'
      },
      rust: {
        starter: 'fn solve(input: i32) -> i32 {\n    // Write your code here\n    0\n}',
        solution: 'fn solve(input: i32) -> i32 {\n    input * 2\n}'
      },
      scala: {
        starter: 'def solve(input: Int): Int = {\n  // Write your code here\n  0\n}',
        solution: 'def solve(input: Int): Int = {\n  input * 2\n}'
      },
      sql: {
        starter: 'SELECT \n  -- Write your query here\n  column_name\nFROM table_name;',
        solution: 'SELECT column_name * 2 AS result\nFROM table_name;'
      },
      r: {
        starter: 'solve <- function(input) {\n  # Write your code here\n  return(0)\n}',
        solution: 'solve <- function(input) {\n  return(input * 2)\n}'
      },
      matlab: {
        starter: 'function result = solve(input)\n    % Write your code here\n    result = 0;\nend',
        solution: 'function result = solve(input)\n    result = input * 2;\nend'
      },
      perl: {
        starter: 'sub solve {\n    my ($input) = @_;\n    # Write your code here\n    return 0;\n}',
        solution: 'sub solve {\n    my ($input) = @_;\n    return $input * 2;\n}'
      },
      bash: {
        starter: '#!/bin/bash\nsolve() {\n    local input=$1\n    # Write your code here\n    echo 0\n}',
        solution: '#!/bin/bash\nsolve() {\n    local input=$1\n    echo $((input * 2))\n}'
      },
      shell: {
        starter: '#!/bin/bash\nsolve() {\n    local input=$1\n    # Write your code here\n    echo 0\n}',
        solution: '#!/bin/bash\nsolve() {\n    local input=$1\n    echo $((input * 2))\n}'
      }
    };
    
    const langExample = examples[language.toLowerCase()] || examples.javascript;

    const prompt = `You are a programming instructor. Create ${count} coding challenge${count > 1 ? 's' : ''} about ${topic} in ${language}.

CRITICAL: Return ONLY a valid JSON array. No other text.

Example format:
[
  {
    "questionText": "Write a function that solves X",
    "language": "${language}",
    "starterCode": "${langExample.starter.replace(/\n/g, '\\n').replace(/"/g, '\\"')}",
    "solution": "${langExample.solution.replace(/\n/g, '\\n').replace(/"/g, '\\"')}",
    "testCases": [
      {"input": "5", "expectedOutput": "10", "isHidden": false}
    ],
    "hints": ["Think about using loops"],
    "estimatedTime": 600,
    "points": ${points[difficulty]},
    "tags": ["${topic}", "${language}"]
  }
]

Generate ${count} question${count > 1 ? 's' : ''} following this format exactly.`;

    try {
      // Use simple string prompt format for old SDK with retry logic
      const result = await this.retryWithBackoff(async () => {
        return await this.model.generateContent(prompt);
      });
      
      if (!result || !result.response) {
        throw new Error('Gemini returned no response. The API may be unavailable or rate-limited.');
      }
      
      const response = result.response;
      const text = response.text();
      
      if (!text || text.trim() === '') {
        console.error('Gemini returned empty text for topic:', topic, 'language:', language);
        throw new Error(`Gemini API is currently unavailable for coding questions. Please try: (1) Multiple Choice questions instead, (2) Wait a few minutes and retry, or (3) Use a different topic.`);
      }
      
      const questions = this.parseGeminiJSON(text, 'coding');
      
      console.log(`✓ Generated ${questions.length} coding questions on topic: ${topic}`);
      return questions;
      
    } catch (error) {
      console.error('Error generating coding questions:', error.message);
      if (error.message.includes('429') || error.message.includes('quota')) {
        throw new Error('API rate limit exceeded. Please wait a moment and try again.');
      }
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
  }

  /**
   * Generate essay questions
   */
  async generateEssayQuestion(topic, difficulty = 'medium', count = 1) {
    if (!this.isAvailable()) {
      throw new Error('Gemini AI service is not available. Please configure GEMINI_API_KEY.');
    }

    const prompt = `Generate ${count} essay question${count > 1 ? 's' : ''} about "${topic}" at ${difficulty} difficulty level.

For each question, provide:
1. Thought-provoking question or prompt
2. Key points that should be covered in a good answer
3. Sample rubric criteria
4. Estimated time: 10-30 minutes
5. Suggested word count (200-800 words)

Format as JSON:
[
  {
    "questionText": "string",
    "rubric": [
      {
        "criterion": "string",
        "points": 10,
        "description": "string"
      }
    ],
    "keyPoints": ["point 1", "point 2"],
    "estimatedTime": 1200,
    "wordCount": { "min": 200, "max": 500 },
    "tags": ["tag1", "tag2"]
  }
]

Requirements:
- Questions should encourage critical thinking
- Rubric should be clear and objective
- Cover important concepts in the topic

Return ONLY the JSON array.`;

    try {
      const result = await this.retryWithBackoff(async () => {
        return await this.model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
        });
      });
      
      const response = result.response;
      const text = response.text();
      
      const questions = this.parseGeminiJSON(text, 'essay');
      
      console.log(`✓ Generated ${questions.length} essay questions on topic: ${topic}`);
      return questions;
      
    } catch (error) {
      console.error('Error generating essay questions:', error);
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
  }

  /**
   * Generate mixed question types
   */
  async generateMixedQuestions(topic, difficulty = 'medium', distribution = {}) {
    const {
      multipleChoice = 5,
      trueFalse = 3,
      coding = 2,
      essay = 1
    } = distribution;

    const results = {
      multipleChoice: [],
      trueFalse: [],
      coding: [],
      essay: [],
      totalGenerated: 0
    };

    try {
      if (multipleChoice > 0) {
        results.multipleChoice = await this.generateMultipleChoiceQuestion(topic, difficulty, multipleChoice);
      }
      
      if (trueFalse > 0) {
        results.trueFalse = await this.generateTrueFalseQuestion(topic, difficulty, trueFalse);
      }
      
      if (coding > 0) {
        // For coding questions, we need a language - default to JavaScript
        results.coding = await this.generateCodingQuestion(topic, 'javascript', difficulty, coding);
      }
      
      if (essay > 0) {
        results.essay = await this.generateEssayQuestion(topic, difficulty, essay);
      }

      results.totalGenerated = 
        results.multipleChoice.length +
        results.trueFalse.length +
        results.coding.length +
        results.essay.length;

      console.log(`Generated ${results.totalGenerated} mixed questions on topic: ${topic}`);
      return results;
      
    } catch (error) {
      console.error('Error generating mixed questions:', error);
      throw error;
    }
  }

  /**
   * Improve existing question
   */
  async improveQuestion(questionText, questionType, feedback) {
    if (!this.isAvailable()) {
      throw new Error('Gemini AI service is not available. Please configure GEMINI_API_KEY.');
    }

    const prompt = `Improve the following ${questionType} question based on the feedback provided.

Original Question:
${questionText}

Feedback:
${feedback}

Provide an improved version that addresses the feedback while maintaining the question's intent. Return as JSON:
{
  "improvedQuestionText": "string",
  "changes": ["change 1", "change 2"],
  "reasoning": "explanation of improvements"
}

Return ONLY the JSON object.`;

    try {
      const result = await this.retryWithBackoff(async () => {
        return await this.model.generateContent(prompt);
      });
      
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from Gemini');
      }
      
      const improvement = JSON.parse(jsonMatch[0]);
      
      console.log('Question improved successfully');
      return improvement;
      
    } catch (error) {
      console.error('Error improving question:', error);
      throw new Error(`Failed to improve question: ${error.message}`);
    }
  }

  /**
   * Validate question quality
   */
  async validateQuestion(questionText, questionType) {
    if (!this.isAvailable()) {
      throw new Error('Gemini AI service is not available. Please configure GEMINI_API_KEY.');
    }

    const prompt = `Analyze the quality of this ${questionType} question:

"${questionText}"

Evaluate based on:
1. Clarity - Is the question clear and unambiguous?
2. Relevance - Does it test important knowledge?
3. Difficulty - Is it appropriately challenging?
4. Fairness - Can it be answered with proper knowledge?
5. Technical accuracy - Is it factually correct?

Provide a quality score (0-100) and specific feedback. Return as JSON:
{
  "qualityScore": 85,
  "clarity": 90,
  "relevance": 85,
  "difficulty": 80,
  "fairness": 90,
  "technicalAccuracy": 95,
  "feedback": ["point 1", "point 2"],
  "suggestions": ["improvement 1", "improvement 2"]
}

Return ONLY the JSON object.`;

    try {
      const result = await this.retryWithBackoff(async () => {
        return await this.model.generateContent(prompt);
      });
      
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON response from Gemini');
      }
      
      const validation = JSON.parse(jsonMatch[0]);
      
      console.log(`Question validation completed with score: ${validation.qualityScore}`);
      return validation;
      
    } catch (error) {
      console.error('Error validating question:', error);
      throw new Error(`Failed to validate question: ${error.message}`);
    }
  }
}

// Export singleton instance
module.exports = new GeminiService();
