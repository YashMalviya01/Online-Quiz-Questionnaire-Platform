const OpenAI = require('openai');

/**
 * OpenAI Service for Quiz Generation
 * Uses GPT models to generate quiz questions
 */

class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.client = null;
    
    if (this.apiKey) {
      try {
        this.client = new OpenAI({
          apiKey: this.apiKey
        });
        console.log('✓ OpenAI service initialized successfully with gpt-4o-mini');
      } catch (error) {
        console.error('✗ Failed to initialize OpenAI:', error);
      }
    } else {
      console.warn('⚠ OPENAI_API_KEY not found in environment variables');
    }
  }

  /**
   * Check if OpenAI service is available
   */
  isAvailable() {
    return this.client !== null;
  }

  /**
   * Retry logic with exponential backoff for API calls
   */
  async retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        const isLastAttempt = attempt === maxRetries;
        const isRetryableError = error.status === 429 || 
                                  error.status === 503 ||
                                  error.message?.includes('rate limit') ||
                                  error.message?.includes('overloaded');
        
        if (!isRetryableError || isLastAttempt) {
          throw error;
        }
        
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.log(`⏳ Retry ${attempt}/${maxRetries} in ${delay}ms - API rate limited`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Parse JSON from OpenAI response
   */
  parseJSON(text, context = '') {
    try {
      // Remove markdown code blocks if present
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Try to extract JSON array
      const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Try parsing full text
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error(`Failed to parse JSON for ${context}:`, error.message);
      console.error('Raw text:', text.substring(0, 500));
      throw new Error(`Failed to parse JSON response: ${error.message}`);
    }
  }

  /**
   * Generate multiple-choice questions
   */
  async generateMultipleChoiceQuestion(topic, difficulty, count) {
    if (!this.isAvailable()) {
      throw new Error('OpenAI service is not available. Please check your API key.');
    }

    const points = { easy: 10, medium: 20, hard: 30 };

    const prompt = `Generate ${count} multiple-choice question${count > 1 ? 's' : ''} about "${topic}" with ${difficulty} difficulty.

Return ONLY a valid JSON array with this exact structure (no markdown, no explanation):
[
  {
    "questionText": "Clear question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Brief explanation why this is correct",
    "points": ${points[difficulty]},
    "difficulty": "${difficulty}",
    "estimatedTime": 30,
    "tags": ["${topic}"]
  }
]

Requirements:
- Questions should test understanding, not just memorization
- Options should be plausible and mutually exclusive
- Avoid "all of the above" or "none of the above"
- Use technical accuracy and current best practices

Return ONLY the JSON array, no additional text.`;

    try {
      const completion = await this.retryWithBackoff(async () => {
        return await this.client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert quiz question generator. Always respond with valid JSON only."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        });
      });

      const text = completion.choices[0].message.content;
      const questions = this.parseJSON(text, 'multiple-choice');
      
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
  async generateTrueFalseQuestion(topic, difficulty, count) {
    if (!this.isAvailable()) {
      throw new Error('OpenAI service is not available. Please check your API key.');
    }

    const points = { easy: 5, medium: 10, hard: 15 };

    const prompt = `Generate ${count} true/false question${count > 1 ? 's' : ''} about "${topic}" with ${difficulty} difficulty.

Return ONLY a valid JSON array:
[
  {
    "questionText": "Statement to evaluate as true or false",
    "correctAnswer": true,
    "explanation": "Explanation of why this is true/false",
    "points": ${points[difficulty]},
    "difficulty": "${difficulty}",
    "estimatedTime": 20,
    "tags": ["${topic}"]
  }
]

Requirements:
- Statements should be clear and unambiguous
- Avoid trick questions or double negatives
- Test conceptual understanding

Return ONLY the JSON array.`;

    try {
      const completion = await this.retryWithBackoff(async () => {
        return await this.client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are an expert quiz question generator. Always respond with valid JSON only." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1500
        });
      });

      const text = completion.choices[0].message.content;
      const questions = this.parseJSON(text, 'true-false');
      
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
  async generateCodingQuestion(topic, language, difficulty, count) {
    if (!this.isAvailable()) {
      throw new Error('OpenAI service is not available. Please check your API key.');
    }

    const points = { easy: 30, medium: 50, hard: 70 };

    const prompt = `Generate ${count} coding challenge${count > 1 ? 's' : ''} about "${topic}" in ${language} with ${difficulty} difficulty.

Return ONLY a valid JSON array:
[
  {
    "questionText": "Clear problem description",
    "language": "${language}",
    "starterCode": "function solve(input) {\\n  // Write your code here\\n  return result;\\n}",
    "solution": "function solve(input) {\\n  // Complete solution\\n  return result;\\n}",
    "testCases": [
      {"input": "5", "expectedOutput": "10", "isHidden": false}
    ],
    "hints": ["Helpful hint"],
    "estimatedTime": 600,
    "points": ${points[difficulty]},
    "tags": ["${topic}", "${language}"]
  }
]

Return ONLY the JSON array.`;

    try {
      const completion = await this.retryWithBackoff(async () => {
        return await this.client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are an expert programming instructor. Always respond with valid JSON only." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 3000
        });
      });

      const text = completion.choices[0].message.content;
      const questions = this.parseJSON(text, 'coding');
      
      console.log(`✓ Generated ${questions.length} coding questions on topic: ${topic}`);
      return questions;
      
    } catch (error) {
      console.error('Error generating coding questions:', error);
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
  }

  /**
   * Generate essay questions
   */
  async generateEssayQuestion(topic, difficulty, count) {
    if (!this.isAvailable()) {
      throw new Error('OpenAI service is not available. Please check your API key.');
    }

    const points = { easy: 20, medium: 30, hard: 40 };

    const prompt = `Generate ${count} essay question${count > 1 ? 's' : ''} about "${topic}" with ${difficulty} difficulty.

Return ONLY a valid JSON array:
[
  {
    "questionText": "Essay prompt or question",
    "rubric": {
      "criteria": ["Understanding of concepts", "Clarity of explanation", "Use of examples"],
      "maxScore": ${points[difficulty]}
    },
    "sampleAnswer": "Brief sample answer showing key points",
    "points": ${points[difficulty]},
    "difficulty": "${difficulty}",
    "estimatedTime": 900,
    "tags": ["${topic}"]
  }
]

Return ONLY the JSON array.`;

    try {
      const completion = await this.retryWithBackoff(async () => {
        return await this.client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are an expert quiz question generator. Always respond with valid JSON only." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000
        });
      });

      const text = completion.choices[0].message.content;
      const questions = this.parseJSON(text, 'essay');
      
      console.log(`✓ Generated ${questions.length} essay questions on topic: ${topic}`);
      return questions;
      
    } catch (error) {
      console.error('Error generating essay questions:', error);
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
  }
}

module.exports = new OpenAIService();
