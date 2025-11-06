const axios = require('axios');

/**
 * Ollama Service for Quiz Generation
 * Uses locally running Ollama with Llama models
 */

class OllamaService {
  constructor() {
    // Default to Mac Mini M4 with qwen2.5-coder:7b via ngrok (public access)
    this.apiEndpoint = process.env.OLLAMA_API_ENDPOINT || 'https://smart-quiz.major-project.ngrok.dev/api/generate';
    this.model = process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b';
    this.timeout = 180000; // 3 minutes for larger model
    
    // Enhanced system prompt with project context
    this.systemPrompt = `You are an expert quiz question generator for an advanced online quiz platform specializing in programming education.

PLATFORM CONTEXT:
- Supported Languages: JavaScript, Python, Java, C++
- Question Types: Multiple Choice, True/False, Fill-in-Blank, Coding, Essay
- Difficulty Levels: Easy, Medium, Hard
- Focus: Programming concepts, practical applications, real-world scenarios

QUALITY STANDARDS:
1. ACCURACY - All questions must be technically correct and current
2. CLARITY - Questions should be unambiguous and easy to understand
3. RELEVANCE - Directly related to the specified topic and language
4. APPROPRIATE DIFFICULTY - Match the requested level
5. EDUCATIONAL - Test real understanding, not just memorization

RESPONSE FORMAT:
- Always respond with ONLY valid JSON
- No markdown code blocks, no additional text
- Follow the exact structure requested
- Ensure all required fields are present

QUESTION GUIDELINES:
Multiple Choice:
- Exactly 4 options
- Plausible but distinct options
- One clear correct answer
- Avoid "all/none of the above"

True/False:
- Test conceptual understanding
- Clear, specific statements
- Avoid trick questions

Fill-in-the-Blank:
- Use ___ for blanks
- Test key concepts
- Provide clear context

Coding:
- Clear problem descriptions
- Include starter code when helpful
- Specify expected outputs
- Focus on practical concepts

LANGUAGE-SPECIFIC:
JavaScript: Modern ES6+, async/await, array methods, promises
Python: Pythonic code, list comprehensions, f-strings, context managers
Java: OOP patterns, collections, generics, exception handling
C++: Modern C++, STL, smart pointers, RAII, templates`;
    
    console.log('✓ Ollama service initialized');
    console.log('  Model:', this.model);
    console.log('  Endpoint:', this.apiEndpoint);
    console.log('  Using: Ollama on Mac Mini M4 with enhanced project context');
  }

  /**
   * Check if Ollama service is available
   */
  async isAvailable() {
    try {
      // Extract base URL from API endpoint (remove /api/generate)
      const baseUrl = this.apiEndpoint.replace('/api/generate', '');
      const response = await axios.get(`${baseUrl}/api/tags`, { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.warn('⚠ Ollama service not available:', error.message);
      
      // Try fallback to local Docker Ollama if Mac Mini fails
      try {
        const fallbackUrl = 'http://host.docker.internal:11434';
        const fallbackResponse = await axios.get(`${fallbackUrl}/api/tags`, { timeout: 5000 });
        if (fallbackResponse.status === 200) {
          console.log('✓ Switching to fallback Ollama service (local Docker)');
          this.apiEndpoint = `${fallbackUrl}/api/generate`;
          return true;
        }
      } catch (fallbackError) {
        console.warn('⚠ Fallback Ollama also unavailable:', fallbackError.message);
      }
      
      return false;
    }
  }

  /**
   * Generate completion using Ollama
   */
  async generateCompletion(prompt, options = {}) {
    try {
      // Combine system prompt with user prompt
      const fullPrompt = `${this.systemPrompt}\n\n${prompt}`;
      
      const response = await axios.post(
        this.apiEndpoint,
        {
          model: this.model,
          prompt: fullPrompt,
          stream: false,
          options: {
            temperature: options.temperature || 0.7,
            top_p: options.top_p || 0.9,
            num_predict: options.max_tokens || 2000
          }
        },
        { timeout: this.timeout }
      );

      return response.data.response;
    } catch (error) {
      console.error('Ollama generation error:', error.message);
      throw new Error(`Failed to generate with Ollama: ${error.message}`);
    }
  }

  /**
   * Clean and extract JSON from model response
   */
  cleanJsonResponse(response) {
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
    
    // Remove any text after last } or ]
    const lastBrace = Math.max(cleaned.lastIndexOf('}'), -1);
    const lastBracket = Math.max(cleaned.lastIndexOf(']'), -1);
    const jsonEnd = Math.max(lastBrace, lastBracket);
    
    if (jsonEnd !== -1 && jsonEnd < cleaned.length - 1) {
      cleaned = cleaned.substring(0, jsonEnd + 1);
    }
    
    // Fix backticks in JSON strings - replace with single quotes
    // JSON.parse doesn't recognize \` as valid escape, so replace backticks with quotes
    let result = '';
    let inString = false;
    let escapeNext = false;
    
    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];
      
      if (escapeNext) {
        result += char;
        escapeNext = false;
        continue;
      }
      
      if (char === '\\') {
        result += char;
        escapeNext = true;
        continue;
      }
      
      if (char === '"') {
        inString = !inString;
        result += char;
        continue;
      }
      
      // Replace backticks inside JSON strings with single quotes
      if (char === '`' && inString) {
        result += "'";
      } else {
        result += char;
      }
    }
    
    return result;
  }

  /**
   * Generate multiple choice question
   */
  async generateMultipleChoiceQuestion(topic, difficulty = 'medium', count = 1, customPrompt = '') {
    // Handle prompt-only generation
    let prompt;
    if (customPrompt && !topic) {
      prompt = `Generate ${count} multiple choice question(s) based on the following requirements:

${customPrompt}

Requirements:
- ${difficulty} difficulty level
- Exactly ${count} question(s)
- Each question must have exactly 4 options (A, B, C, D)
- One clear correct answer
- Brief explanation`;
    } else {
      const additionalInstructions = customPrompt ? `\n\nADDITIONAL REQUIREMENTS:\n${customPrompt}` : '';
      
      prompt = `Generate ${count} multiple choice question(s) about "${topic}" with ${difficulty} difficulty.

For each question, provide:
1. The question text
2. Four answer options (A, B, C, D)
3. The correct answer (letter)${additionalInstructions}
4. A brief explanation`;
    }

    prompt += `

Format your response as JSON array:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "A",
    "explanation": "Explanation here"
  }
]

Only return the JSON array, no additional text.`;

    try {
      const response = await this.generateCompletion(prompt, { temperature: 0.8 });
      const cleanedResponse = this.cleanJsonResponse(response);
      
      console.log('MCQ cleaned response preview:', cleanedResponse.substring(0, 200));
      
      try {
        const questions = JSON.parse(cleanedResponse);
        const questionsArray = Array.isArray(questions) ? questions : [questions];
        
        return questionsArray.map(q => ({
          questionText: q.question || q.questionText,
          questionType: 'multiple-choice',
          options: q.options || [],
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || '',
          difficulty: difficulty,
          topic: topic || 'General',
          category: 'AI-Generated',
          tags: [topic || 'ai-generated', difficulty]
        }));
      } catch (parseError) {
        console.error('MCQ JSON parse error:', parseError.message);
        console.error('Cleaned response:', cleanedResponse.substring(0, 500));
        throw new Error(`Invalid JSON format: ${parseError.message}`);
      }
    } catch (error) {
      console.error('Error generating MCQ:', error);
      throw error;
    }
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
   * Generate coding question(s)
   */
  async generateCodingQuestion(topic, language = 'javascript', difficulty = 'medium', count = 1) {
    const prompt = `Generate ${count} coding question(s) about "${topic}" in ${language} with ${difficulty} difficulty.

For each question, provide:
1. Problem description
2. Function signature or starter code
3. Example test cases (array of strings)
4. Sample solution

Format as JSON array:
[
  {
    "questionText": "Problem description",
    "starterCode": "function template",
    "testCases": ["test case 1", "test case 2"],
    "solution": "sample solution code",
    "hints": ["hint 1", "hint 2"]
  }
]

Only return the JSON array, no additional text.`;

    try {
      const response = await this.generateCompletion(prompt, { temperature: 0.8 });
      const cleanedResponse = this.cleanJsonResponse(response);
      
      console.log('Coding question cleaned response preview:', cleanedResponse.substring(0, 200));
      
      try {
        const questions = JSON.parse(cleanedResponse);
        const questionsArray = Array.isArray(questions) ? questions : [questions];
        
        return questionsArray.map(data => ({
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
        }));
      } catch (parseError) {
        console.error('Coding question JSON parse error:', parseError.message);
        console.error('Cleaned response:', cleanedResponse.substring(0, 500));
        throw new Error(`Invalid JSON format: ${parseError.message}`);
      }
    } catch (error) {
      console.error('Error generating coding question:', error);
      throw error;
    }
  }

  /**
   * Generate SQL question
   */
  async generateSQLQuestion(topic, difficulty = 'medium', count = 1) {
    const difficultyContext = {
      easy: 'basic SELECT, WHERE, simple JOINs',
      medium: 'GROUP BY, aggregate functions, subqueries, multiple JOINs',
      hard: 'complex subqueries, window functions, CTEs, query optimization'
    };

    const prompt = `${this.systemPrompt}

Generate ${count} SQL database question(s) about "${topic}" at ${difficulty} level (${difficultyContext[difficulty]}).

Requirements:
- Provide a clear database schema description
- Include SQL query challenge appropriate for ${difficulty} level
- Provide correct SQL solution
- Include explanation of query logic
- Add sample data context if helpful

Format as JSON array:
[
  {
    "questionText": "Problem description with schema",
    "difficulty": "${difficulty}",
    "correctQuery": "SELECT ... (solution query)",
    "explanation": "Why this query works",
    "schemaDescription": "Table structures and relationships",
    "sampleData": "Optional sample data description"
  }
]

Only return the JSON array, no additional text.`;

    try {
      const response = await this.generateCompletion(prompt, { temperature: 0.7 });
      const cleanedResponse = this.cleanJsonResponse(response);
      
      console.log('SQL question cleaned response preview:', cleanedResponse.substring(0, 200));
      
      try {
        const questions = JSON.parse(cleanedResponse);
        const questionsArray = Array.isArray(questions) ? questions : [questions];
        
        return questionsArray.map(data => ({
          questionText: data.questionText || data.question,
          questionType: 'sql',
          correctQuery: data.correctQuery || '',
          explanation: data.explanation || '',
          schemaDescription: data.schemaDescription || '',
          sampleData: data.sampleData || '',
          difficulty: difficulty,
          topic: topic,
          category: 'AI-Generated'
        }));
      } catch (parseError) {
        console.error('SQL question JSON parse error:', parseError.message);
        console.error('Cleaned response:', cleanedResponse.substring(0, 500));
        throw new Error(`Invalid JSON format: ${parseError.message}`);
      }
    } catch (error) {
      console.error('Error generating SQL question:', error);
      throw error;
    }
  }

  /**
   * Generate mixed question types
   */
  async generateMixedQuestions(topic, difficulty = 'medium', distribution = {}, customPrompt = '') {
    try {
      const {
        multipleChoice = 3,
        trueFalse = 2,
        coding = 2,
        sql = 2,
        essay = 1
      } = distribution;

      console.log(`Generating mixed questions: MC=${multipleChoice}, TF=${trueFalse}, Coding=${coding}, SQL=${sql}, Essay=${essay}`);

      const results = {
        multipleChoice: [],
        trueFalse: [],
        coding: [],
        sql: [],
        essay: []
      };

      // Generate all question types in parallel for better performance
      const promises = [];

      // Generate multiple choice questions
      if (multipleChoice > 0) {
        promises.push(
          this.generateMultipleChoiceQuestion(topic, difficulty, multipleChoice, customPrompt)
            .then(questions => { results.multipleChoice = questions; })
            .catch(err => { console.error('MC generation failed:', err); results.multipleChoice = []; })
        );
      }

      // Generate true/false questions
      if (trueFalse > 0) {
        promises.push(
          Promise.all(Array(trueFalse).fill().map(() => 
            this.generateTrueFalseQuestion(topic, difficulty)
          ))
            .then(questions => { results.trueFalse = questions; })
            .catch(err => { console.error('T/F generation failed:', err); results.trueFalse = []; })
        );
      }

      // Generate coding questions
      if (coding > 0) {
        promises.push(
          this.generateCodingQuestion(topic, 'javascript', difficulty, coding)
            .then(questions => { results.coding = questions; })
            .catch(err => { console.error('Coding generation failed:', err); results.coding = []; })
        );
      }

      // Generate SQL questions
      if (sql > 0) {
        promises.push(
          this.generateSQLQuestion(topic, difficulty, sql)
            .then(questions => { results.sql = questions; })
            .catch(err => { console.error('SQL generation failed:', err); results.sql = []; })
        );
      }

      // Generate essay/short answer questions
      if (essay > 0) {
        promises.push(
          Promise.all(Array(essay).fill().map(() => 
            this.generateShortAnswerQuestion(topic, difficulty)
          ))
            .then(questions => { results.essay = questions; })
            .catch(err => { console.error('Essay generation failed:', err); results.essay = []; })
        );
      }

      // Wait for all generations to complete
      await Promise.all(promises);

      console.log('Mixed questions generated successfully');
      return results;
    } catch (error) {
      console.error('Error generating mixed questions:', error);
      throw error;
    }
  }
}

module.exports = new OllamaService();
