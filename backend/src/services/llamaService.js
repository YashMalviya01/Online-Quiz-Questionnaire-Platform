const axios = require('axios');

/**
 * Llama 3.3 Service for Quiz Generation
 * Uses locally running Llama 3.3 70B model via Docker
 */

class LlamaService {
  constructor() {
    // Docker Model Runner default endpoint
    this.apiEndpoint = process.env.LLAMA_API_ENDPOINT || 'http://localhost:8000/v1/chat/completions';
    this.model = 'ai/llama3.3:70B-Q4_K_M';
    this.maxRetries = 3;
    this.timeout = 180000; // 3 minutes for large model
    
    console.log('✓ Llama 3.3 service initialized - connecting to', this.apiEndpoint);
  }

  /**
   * Check if Llama service is available
   */
  async isAvailable() {
    try {
      const response = await axios.get('http://localhost:8000/health', { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.warn('⚠ Llama service not available:', error.message);
      return false;
    }
  }

  /**
   * Retry logic with exponential backoff
   */
  async retryWithBackoff(fn, maxRetries = 3, initialDelay = 2000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        const isLastAttempt = attempt === maxRetries;
        const isRetryableError = error.code === 'ECONNREFUSED' || 
                                  error.code === 'ETIMEDOUT' ||
                                  error.response?.status === 503 ||
                                  error.response?.status === 429;
        
        if (!isRetryableError || isLastAttempt) {
          throw error;
        }
        
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.log(`⏳ Retry ${attempt}/${maxRetries} in ${delay}ms - Model busy`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Generate completion from Llama model
   */
  async generateCompletion(systemPrompt, userPrompt, temperature = 0.7, maxTokens = 4000) {
    try {
      const response = await this.retryWithBackoff(async () => {
        return await axios.post(
          this.apiEndpoint,
          {
            model: this.model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: temperature,
            max_tokens: maxTokens,
            stream: false
          },
          {
            timeout: this.timeout,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Llama model is not running. Please start it with: docker model run ai/llama3.3');
      }
      throw error;
    }
  }

  /**
   * Parse JSON from model response
   */
  parseJSON(text, context = '') {
    try {
      // Remove markdown code blocks
      let cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Extract JSON array
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
    const points = { easy: 10, medium: 20, hard: 30 };

    const systemPrompt = 'You are an expert quiz question generator. Always respond with valid JSON only. Do not include any explanatory text outside the JSON structure.';

    const userPrompt = `Generate ${count} multiple-choice question${count > 1 ? 's' : ''} about "${topic}" with ${difficulty} difficulty.

Return ONLY a valid JSON array with this exact structure:
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
- Questions should test understanding, not memorization
- Options should be plausible and mutually exclusive
- Avoid "all of the above" or "none of the above"
- Use technical accuracy and current best practices

Return ONLY the JSON array.`;

    try {
      const text = await this.generateCompletion(systemPrompt, userPrompt, 0.7, 3000);
      const questions = this.parseJSON(text, 'multiple-choice');
      
      console.log(`✓ Generated ${questions.length} multiple-choice questions on: ${topic}`);
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
    const points = { easy: 5, medium: 10, hard: 15 };

    const systemPrompt = 'You are an expert quiz question generator. Always respond with valid JSON only.';

    const userPrompt = `Generate ${count} true/false question${count > 1 ? 's' : ''} about "${topic}" with ${difficulty} difficulty.

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

Return ONLY the JSON array.`;

    try {
      const text = await this.generateCompletion(systemPrompt, userPrompt, 0.7, 2000);
      const questions = this.parseJSON(text, 'true-false');
      
      console.log(`✓ Generated ${questions.length} true/false questions on: ${topic}`);
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
    const points = { easy: 30, medium: 50, hard: 70 };

    const systemPrompt = 'You are an expert programming instructor. Always respond with valid JSON only.';

    const userPrompt = `Generate ${count} coding challenge${count > 1 ? 's' : ''} about "${topic}" in ${language} with ${difficulty} difficulty.

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

Make the code practical and solvable. Return ONLY the JSON array.`;

    try {
      const text = await this.generateCompletion(systemPrompt, userPrompt, 0.7, 4000);
      const questions = this.parseJSON(text, 'coding');
      
      console.log(`✓ Generated ${questions.length} coding questions on: ${topic}`);
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
    const points = { easy: 20, medium: 30, hard: 40 };

    const systemPrompt = 'You are an expert quiz question generator. Always respond with valid JSON only.';

    const userPrompt = `Generate ${count} essay question${count > 1 ? 's' : ''} about "${topic}" with ${difficulty} difficulty.

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
      const text = await this.generateCompletion(systemPrompt, userPrompt, 0.7, 3000);
      const questions = this.parseJSON(text, 'essay');
      
      console.log(`✓ Generated ${questions.length} essay questions on: ${topic}`);
      return questions;
    } catch (error) {
      console.error('Error generating essay questions:', error);
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
  }
}

module.exports = new LlamaService();
