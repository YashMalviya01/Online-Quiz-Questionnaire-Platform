const axios = require('axios');

/**
 * Docker Model Runner Service for Quiz Generation
 * Uses Docker Model Runner with qwen3 model via HTTP Proxy
 */

class DockerModelService {
  constructor() {
    // Use proxy endpoint that forwards to docker model CLI
    this.apiEndpoint = process.env.DOCKER_MODEL_ENDPOINT || 'http://host.docker.internal:11435';
    this.modelName = process.env.DOCKER_MODEL || 'qwen3';
    this.timeout = 120000; // 2 minutes
    
    // System prompt to fine-tune the model for quiz generation
    this.systemPrompt = `You are an expert quiz question generator for an online learning platform. Your role is to create high-quality, educational quiz questions that are:

1. ACCURATE - Questions must be factually correct and well-researched
2. CLEAR - Language should be unambiguous and easy to understand
3. RELEVANT - Questions should directly relate to the specified topic
4. APPROPRIATE - Difficulty should match the requested level (easy/medium/hard)
5. EDUCATIONAL - Questions should test real understanding, not just memorization

For Multiple Choice Questions:
- Provide 4 options (A, B, C, D)
- Make distractors plausible but clearly incorrect
- Avoid "all of the above" or "none of the above"
- Include brief explanations

For Coding Questions:
- Provide clear problem descriptions
- Include starter code templates
- Specify test cases with expected outputs
- Give helpful hints without revealing the solution

For True/False Questions:
- Create statements that test conceptual understanding
- Avoid trick questions
- Provide clear explanations

For Short Answer Questions:
- Ask open-ended questions requiring explanation
- Provide sample answers and grading criteria

CRITICAL: Always respond with valid JSON only. No additional text, no markdown code blocks, just pure JSON.`;
    
    console.log('✓ Docker Model service initialized');
    console.log('  Model:', this.modelName);
    console.log('  Endpoint:', this.apiEndpoint);
    console.log('  Using: Docker Model Runner Proxy');
  }

  /**
   * Check if Docker Model service is available
   */
  async isAvailable() {
    try {
      const response = await axios.get(`${this.apiEndpoint}/health`, { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.warn('⚠ Docker Model Runner Proxy not available:', error.message);
      return false;
    }
  }

  /**
   * Generate completion using Docker Model Runner
   */
  async generateCompletion(prompt, options = {}) {
    try {
      // Prepend system prompt to guide the model
      const fullPrompt = `${this.systemPrompt}\n\n${prompt}`;
      
      const response = await axios.post(
        `${this.apiEndpoint}/api/generate`,
        {
          prompt: fullPrompt,
          model: this.modelName
        },
        {
          timeout: this.timeout,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      return response.data.response;
    } catch (error) {
      console.error('Docker Model generation error:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      throw new Error(`Failed to generate with Docker Model: ${error.message}`);
    }
  }

  /**
   * Clean and extract JSON from model response
   */
  cleanJsonResponse(response) {
    // gpt-oss model format: "Thinking:\n...\n--\n{json}\n..."
    // Remove thinking section if present
    if (response.includes('Thinking:') && response.includes('--')) {
      const parts = response.split('--');
      response = parts.length > 1 ? parts.slice(1).join('--') : response;
    }
    
    // Remove markdown code blocks
    let cleaned = response.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
    
    // Remove any text before first { or [
    const jsonStart = Math.min(
      cleaned.indexOf('{') !== -1 ? cleaned.indexOf('{') : Infinity,
      cleaned.indexOf('[') !== -1 ? cleaned.indexOf('[') : Infinity
    );
    
    if (jsonStart !== Infinity && jsonStart > 0) {
      cleaned = cleaned.substring(jsonStart);
    }
    
    // Find the first complete JSON object/array
    // Handle nested braces by counting them
    let depth = 0;
    let inString = false;
    let escape = false;
    let jsonEnd = -1;
    
    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];
      
      if (escape) {
        escape = false;
        continue;
      }
      
      if (char === '\\') {
        escape = true;
        continue;
      }
      
      if (char === '"' && !escape) {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '{' || char === '[') {
          depth++;
        } else if (char === '}' || char === ']') {
          depth--;
          if (depth === 0) {
            jsonEnd = i;
            break;
          }
        }
      }
    }
    
    if (jsonEnd !== -1) {
      cleaned = cleaned.substring(0, jsonEnd + 1);
    }
    
    return cleaned;
  }

  /**
   * Generate multiple choice question with progress callback
   */
  async generateMultipleChoiceQuestion(topic, difficulty = 'medium', count = 1, progressCallback = null) {
    const allQuestions = [];
    
    // Generate questions one by one for progress tracking
    for (let i = 0; i < count; i++) {
      if (progressCallback) {
        progressCallback(i + 1, count);
      }
      
      const prompt = `Generate 1 multiple choice question about "${topic}" with ${difficulty} difficulty.

For each question, provide:
1. The question text
2. Four answer options (A, B, C, D)
3. The correct answer (letter)
4. A brief explanation

Format your response as JSON object:
{
  "question": "Question text here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "A",
  "explanation": "Explanation here"
}

Only return the JSON object, no additional text.`;

      try {
        const response = await this.generateCompletion(prompt, { temperature: 0.8 });
        const cleanedResponse = this.cleanJsonResponse(response);
        
        console.log(`MCQ ${i+1}/${count} cleaned response preview:`, cleanedResponse.substring(0, 200));
        
        try {
          const question = JSON.parse(cleanedResponse);
          
          allQuestions.push({
            question: question.question,
            type: 'multiple-choice',
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation || '',
            difficulty: difficulty,
            topic: topic,
            category: 'AI-Generated'
          });
        } catch (parseError) {
          console.error(`MCQ ${i+1}/${count} JSON parse error:`, parseError.message);
          console.error('Cleaned response:', cleanedResponse.substring(0, 500));
          throw new Error(`Invalid JSON format: ${parseError.message}`);
        }
      } catch (error) {
        console.error(`Error generating MCQ ${i+1}/${count}:`, error);
        throw error;
      }
    }
    
    return allQuestions;
  }

  /**
   * Generate true/false question
   */
  async generateTrueFalseQuestion(topic, difficulty = 'medium') {
    const prompt = `Generate a true/false question about "${topic}" with ${difficulty} difficulty.

Provide:
1. A statement
2. Whether it's true or false
3. A brief explanation

Format as JSON:
{
  "question": "Statement here",
  "correctAnswer": "True" or "False",
  "explanation": "Explanation here"
}

Only return the JSON object, no additional text.`;

    try {
      const response = await this.generateCompletion(prompt, { temperature: 0.7 });
      const cleanedResponse = this.cleanJsonResponse(response);
      
      try {
        const data = JSON.parse(cleanedResponse);
        return {
          question: data.question,
          type: 'true-false',
          correctAnswer: data.correctAnswer,
          explanation: data.explanation || '',
          difficulty: difficulty,
          topic: topic,
          category: 'AI-Generated'
        };
      } catch (parseError) {
        console.error('T/F JSON parse error:', parseError.message);
        console.error('Cleaned response:', cleanedResponse.substring(0, 500));
        throw new Error(`Invalid JSON format: ${parseError.message}`);
      }
    } catch (error) {
      console.error('Error generating T/F:', error);
      throw error;
    }
  }

  /**
   * Generate short answer question
   */
  async generateShortAnswerQuestion(topic, difficulty = 'medium') {
    const prompt = `Generate a short answer question about "${topic}" with ${difficulty} difficulty.

Provide:
1. The question
2. A sample correct answer
3. Grading criteria

Format as JSON:
{
  "question": "Question here?",
  "sampleAnswer": "Sample answer here",
  "gradingCriteria": "What to look for in answers"
}

Only return the JSON object, no additional text.`;

    try {
      const response = await this.generateCompletion(prompt);
      const cleanedResponse = this.cleanJsonResponse(response);
      
      try {
        const data = JSON.parse(cleanedResponse);
        return {
          question: data.question,
          type: 'short-answer',
          sampleAnswer: data.sampleAnswer,
          gradingCriteria: data.gradingCriteria || '',
          difficulty: difficulty,
          topic: topic,
          category: 'AI-Generated'
        };
      } catch (parseError) {
        console.error('Short answer JSON parse error:', parseError.message);
        console.error('Cleaned response:', cleanedResponse.substring(0, 500));
        throw new Error(`Invalid JSON format: ${parseError.message}`);
      }
    } catch (error) {
      console.error('Error generating short answer:', error);
      throw error;
    }
  }

  /**
   * Generate coding question(s) with progress callback
   */
  async generateCodingQuestion(topic, language = 'javascript', difficulty = 'medium', count = 1, progressCallback = null) {
    const allQuestions = [];
    
    // Generate questions one by one for progress tracking
    for (let i = 0; i < count; i++) {
      if (progressCallback) {
        progressCallback(i + 1, count);
      }
      
      const prompt = `Generate 1 coding question about "${topic}" in ${language} with ${difficulty} difficulty.

Provide:
1. Problem description
2. Function signature or starter code
3. Example test cases (array of strings)
4. Sample solution

Format as JSON object:
{
  "questionText": "Problem description",
  "starterCode": "function template",
  "testCases": ["test case 1", "test case 2"],
  "solution": "sample solution code",
  "hints": ["hint 1", "hint 2"]
}

Only return the JSON object, no additional text.`;

      try {
        const response = await this.generateCompletion(prompt, { temperature: 0.8 });
        const cleanedResponse = this.cleanJsonResponse(response);
        
        console.log(`Coding question ${i+1}/${count} cleaned response preview:`, cleanedResponse.substring(0, 200));
        
        try {
          const data = JSON.parse(cleanedResponse);
          
          allQuestions.push({
            questionText: data.questionText || data.question,
            type: 'code',
            language: language,
            starterCode: data.starterCode || '',
            testCases: data.testCases || [],
            solution: data.solution || '',
            hints: data.hints || [],
            difficulty: difficulty,
            topic: topic,
            category: 'AI-Generated'
          });
        } catch (parseError) {
          console.error(`Coding question ${i+1}/${count} JSON parse error:`, parseError.message);
          console.error('Cleaned response:', cleanedResponse.substring(0, 500));
          throw new Error(`Invalid JSON format: ${parseError.message}`);
        }
      } catch (error) {
        console.error(`Error generating coding question ${i+1}/${count}:`, error);
        throw error;
      }
    }
    
    return allQuestions;
  }

  /**
   * Generate mixed questions (combination of different types)
   */
  async generateMixedQuestions(topic, difficulty = 'medium', distribution = {}, progressCallback = null) {
    const allQuestions = [];
    
    // Default distribution if not provided
    const defaultDistribution = {
      multipleChoice: 3,
      trueFalse: 2,
      coding: 1,
      essay: 1
    };
    
    const dist = { ...defaultDistribution, ...distribution };
    const totalQuestions = Object.values(dist).reduce((sum, count) => sum + count, 0);
    let currentProgress = 0;
    
    console.log(`Generating ${totalQuestions} mixed questions:`, dist);
    
    // Generate multiple choice questions
    if (dist.multipleChoice > 0) {
      for (let i = 0; i < dist.multipleChoice; i++) {
        currentProgress++;
        if (progressCallback) progressCallback(currentProgress, totalQuestions);
        
        const questions = await this.generateMultipleChoiceQuestion(topic, difficulty, 1);
        allQuestions.push(...questions);
      }
    }
    
    // Generate true/false questions
    if (dist.trueFalse > 0) {
      for (let i = 0; i < dist.trueFalse; i++) {
        currentProgress++;
        if (progressCallback) progressCallback(currentProgress, totalQuestions);
        
        const question = await this.generateTrueFalseQuestion(topic, difficulty);
        allQuestions.push(question);
      }
    }
    
    // Generate coding questions
    if (dist.coding > 0) {
      for (let i = 0; i < dist.coding; i++) {
        currentProgress++;
        if (progressCallback) progressCallback(currentProgress, totalQuestions);
        
        const questions = await this.generateCodingQuestion(topic, 'python', difficulty, 1);
        allQuestions.push(...questions);
      }
    }
    
    // Generate essay questions
    if (dist.essay > 0) {
      for (let i = 0; i < dist.essay; i++) {
        currentProgress++;
        if (progressCallback) progressCallback(currentProgress, totalQuestions);
        
        const question = await this.generateShortAnswerQuestion(topic, difficulty);
        allQuestions.push({ ...question, type: 'essay' });
      }
    }
    
    return allQuestions;
  }
}

module.exports = new DockerModelService();
