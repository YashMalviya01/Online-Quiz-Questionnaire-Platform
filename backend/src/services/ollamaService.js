const axios = require('axios');

/**
 * Ollama Service for Quiz Generation
 * Uses locally running Ollama with Llama models
 */

class OllamaService {
  constructor() {
    // Use local Ollama instance
    this.apiEndpoint = process.env.OLLAMA_API_ENDPOINT || 'http://localhost:11434/api/generate';
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
      
      // Calculate appropriate token limit based on requested count in prompt
      const countMatch = prompt.match(/EXACTLY (\d+) (?:multiple choice )?question/i);
      const requestedCount = countMatch ? parseInt(countMatch[1]) : 5;
      
      // Estimate tokens: ~400 tokens per question (with explanation), add buffer
      const estimatedTokens = Math.min((requestedCount * 400) + 200, 2000);
      
      console.log(`Limiting AI to ${estimatedTokens} tokens for ${requestedCount} question(s)`);
      
      const response = await axios.post(
        this.apiEndpoint,
        {
          model: this.model,
          prompt: fullPrompt,
          stream: false,
          options: {
            temperature: options.temperature || 0.7,
            top_p: options.top_p || 0.9,
            num_predict: options.max_tokens || estimatedTokens // Dynamic token limit
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
      prompt = `You are a quiz generator. Generate EXACTLY ${count} multiple choice question(s) based on the following requirements:

${customPrompt}

CRITICAL REQUIREMENTS:
- Generate EXACTLY ${count} question(s), no more, no less
- ${difficulty} difficulty level
- Each question must have exactly 4 options labeled A, B, C, D
- One clear correct answer (use letter A, B, C, or D)
- Include brief explanation for each answer
- Each question MUST have a "questionText" field`;
    } else {
      const additionalInstructions = customPrompt ? `\n\nADDITIONAL REQUIREMENTS:\n${customPrompt}` : '';
      
      prompt = `You are a quiz generator. Generate EXACTLY ${count} multiple choice question(s) about "${topic}" with ${difficulty} difficulty.

CRITICAL REQUIREMENTS:
- Generate EXACTLY ${count} question(s), no more, no less
- ${difficulty} difficulty level
- Each question must have exactly 4 options labeled A, B, C, D
- One clear correct answer (use letter A, B, C, or D)
- Include brief explanation for each answer
- Each question MUST have a "questionText" field${additionalInstructions}`;
    }

    prompt += `

Format your response as VALID JSON array with EXACTLY ${count} question(s):
[
  {
    "questionText": "Clear question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "A",
    "explanation": "Brief explanation here"
  }
]

CRITICAL - READ CAREFULLY:
- You MUST generate ONLY ${count} question(s), NOT ${count + 1} or ${count + 2} or any other number
- If asked for 5 questions, generate 5, not 9
- If asked for 2 questions, generate 2, not 9
- Count the questions in your JSON array before returning
- The array length MUST be exactly ${count}

IMPORTANT: Return ONLY the JSON array with EXACTLY ${count} questions. NO additional text, NO markdown, NO explanations outside JSON.`;

    try {
      // Use lower temperature for more focused, controlled generation
      const response = await this.generateCompletion(prompt, { temperature: 0.5 });
      const cleanedResponse = this.cleanJsonResponse(response);
      
      console.log('MCQ cleaned response preview:', cleanedResponse.substring(0, 200));
      
      try {
        const questions = JSON.parse(cleanedResponse);
        const questionsArray = Array.isArray(questions) ? questions : [questions];
        
        // Log what AI actually generated
        console.log(`AI generated ${questionsArray.length} questions (requested: ${count})`);
        
        // Validate and strictly limit to requested count
        const validQuestions = questionsArray
          .filter(q => q.questionText || q.question)
          .slice(0, count); // STRICT LIMIT: Only return exact count requested
        
        if (validQuestions.length === 0) {
          throw new Error('No valid questions were generated with questionText field');
        }
        
        // Log if AI generated more than requested
        if (questionsArray.length > count) {
          console.warn(`⚠ AI OVER-GENERATED: Generated ${questionsArray.length} questions but USER ASKED FOR ${count}. Returning only first ${count}.`);
        }
        
        if (validQuestions.length < count) {
          console.warn(`⚠ AI UNDER-GENERATED: Requested ${count} questions but only ${validQuestions.length} valid questions were generated`);
        }
        
        console.log(`✓ Returning exactly ${validQuestions.length} question(s) to user (requested: ${count})`);

        
        return validQuestions.map(q => ({
          questionText: q.questionText || q.question,
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
   * Generate true/false question(s)
   */
  async generateTrueFalseQuestion(topic, difficulty = 'medium', customPrompt = '', count = 1) {
    let prompt;
    if (customPrompt && !topic) {
      prompt = `You are a quiz generator. Generate EXACTLY ${count} true/false question(s) based on the following requirements:

${customPrompt}

CRITICAL REQUIREMENTS:
- Generate EXACTLY ${count} question(s), no more, no less
- ${difficulty} difficulty level
- Each question MUST have a "questionText" field
- correctAnswer must be either "True" or "False" (exact spelling)
- Include brief explanation for each`;
    } else {
      const additionalInstructions = customPrompt ? `\n\nADDITIONAL REQUIREMENTS:\n${customPrompt}` : '';
      
      prompt = `You are a quiz generator. Generate EXACTLY ${count} true/false question(s) about "${topic}" with ${difficulty} difficulty.

CRITICAL REQUIREMENTS:
- Generate EXACTLY ${count} question(s), no more, no less
- ${difficulty} difficulty level
- Each question MUST have a "questionText" field
- correctAnswer must be either "True" or "False" (exact spelling)
- Include brief explanation for each${additionalInstructions}`;
    }

    const formatType = count === 1 ? 'JSON object' : 'JSON array';
    const example = count === 1 
      ? `{
  "questionText": "Clear statement here",
  "correctAnswer": "True",
  "explanation": "Brief explanation here"
}`
      : `[
  {
    "questionText": "Clear statement 1 here",
    "correctAnswer": "True",
    "explanation": "Brief explanation here"
  },
  {
    "questionText": "Clear statement 2 here",
    "correctAnswer": "False",
    "explanation": "Brief explanation here"
  }
]`;

    prompt += `

Format as VALID ${formatType}:
${example}

IMPORTANT: Return ONLY the ${formatType} with EXACTLY ${count} question(s). NO additional text, NO markdown.`;

    try {
      const response = await this.generateCompletion(prompt, { temperature: 0.7 });
      const cleanedResponse = this.cleanJsonResponse(response);
      
      try {
        const data = JSON.parse(cleanedResponse);
        const questionsArray = Array.isArray(data) ? data : [data];
        
        // Validate and limit to requested count
        const validQuestions = questionsArray
          .filter(q => q.questionText || q.question)
          .slice(0, count);
        
        if (validQuestions.length === 0) {
          throw new Error('No valid true/false questions were generated with questionText field');
        }
        
        // Log if AI generated more than requested
        if (questionsArray.length > count) {
          console.warn(`⚠ T/F: AI OVER-GENERATED: Generated ${questionsArray.length} but USER ASKED FOR ${count}. Returning only first ${count}.`);
        }
        
        if (validQuestions.length < count) {
          console.warn(`⚠ T/F: AI UNDER-GENERATED: Requested ${count} questions but only ${validQuestions.length} valid questions were generated`);
        }
        
        console.log(`✓ T/F: Returning exactly ${validQuestions.length} question(s) to user (requested: ${count})`);
        
        const result = validQuestions.map(q => ({
          questionText: q.questionText || q.question,
          questionType: 'true-false',
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || '',
          difficulty: difficulty,
          topic: topic || 'General',
          category: 'AI-Generated',
          tags: [topic || 'ai-generated', difficulty]
        }));
        
        // Return single object if count was 1, otherwise return array
        return count === 1 ? result[0] : result;
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
   * Generate fill-in-the-blank question(s)
   */
  async generateFillInBlank(topic, difficulty = 'medium', count = 1, customPrompt = '') {
    let prompt;
    if (customPrompt && !topic) {
      prompt = `You are a quiz generator. Generate EXACTLY ${count} fill-in-the-blank question(s) based on the following requirements:

${customPrompt}

CRITICAL REQUIREMENTS:
- Generate EXACTLY ${count} question(s), no more, no less
- ${difficulty} difficulty level
- Each question MUST have a "questionText" field with _____ or [blank] marking the blank(s)
- Provide correct answer(s) for the blank(s)
- Include brief explanation`;
    } else {
      const additionalInstructions = customPrompt ? `\n\nADDITIONAL REQUIREMENTS:\n${customPrompt}` : '';
      
      prompt = `You are a quiz generator. Generate EXACTLY ${count} fill-in-the-blank question(s) about "${topic}" with ${difficulty} difficulty.

CRITICAL REQUIREMENTS:
- Generate EXACTLY ${count} question(s), no more, no less
- ${difficulty} difficulty level
- Each question MUST have a "questionText" field with _____ or [blank] marking the blank(s)
- Provide correct answer(s) for the blank(s)
- Include brief explanation${additionalInstructions}`;
    }

    const formatType = count === 1 ? 'JSON object' : 'JSON array';
    const example = count === 1 
      ? `{
  "questionText": "JavaScript is a _____ programming language.",
  "blankAnswers": ["interpreted"],
  "caseSensitive": false,
  "explanation": "JavaScript code is executed by an interpreter, not compiled."
}`
      : `[
  {
    "questionText": "JavaScript is a _____ programming language.",
    "blankAnswers": ["interpreted"],
    "caseSensitive": false,
    "explanation": "JavaScript code is executed by an interpreter."
  },
  {
    "questionText": "The _____ method adds elements to the end of an array.",
    "blankAnswers": ["push"],
    "caseSensitive": true,
    "explanation": "Array.push() is the method to add items at the end."
  }
]`;

    prompt += `

Format as VALID ${formatType}:
${example}

CRITICAL - READ CAREFULLY:
- You MUST generate ONLY ${count} question(s), NOT ${count + 1} or ${count + 2} or any other number
- If asked for 5 questions, generate 5, not 9
- If asked for 2 questions, generate 2, not 9
- Count the questions in your response before returning
- The response MUST contain exactly ${count} question(s)

IMPORTANT: Return ONLY the ${formatType} with EXACTLY ${count} question(s). NO additional text, NO markdown.`;

    try {
      // Use lower temperature for more controlled generation
      const response = await this.generateCompletion(prompt, { temperature: 0.5 });
      const cleanedResponse = this.cleanJsonResponse(response);
      
      try {
        const data = JSON.parse(cleanedResponse);
        const questionsArray = Array.isArray(data) ? data : [data];
        
        // Log what AI actually generated
        console.log(`Fill-in-Blank: AI generated ${questionsArray.length} questions (requested: ${count})`);
        
        // Validate and limit to requested count
        const validQuestions = questionsArray
          .filter(q => q.questionText || q.question)
          .slice(0, count);
        
        if (validQuestions.length === 0) {
          throw new Error('No valid fill-in-the-blank questions were generated with questionText field');
        }
        
        // Log if AI generated more than requested
        if (questionsArray.length > count) {
          console.warn(`⚠ Fill-in-Blank: AI OVER-GENERATED: Generated ${questionsArray.length} but USER ASKED FOR ${count}. Returning only first ${count}.`);
        }
        
        if (validQuestions.length < count) {
          console.warn(`⚠ Fill-in-Blank: AI UNDER-GENERATED: Requested ${count} questions but only ${validQuestions.length} valid questions were generated`);
        }
        
        console.log(`✓ Fill-in-Blank: Returning exactly ${validQuestions.length} question(s) to user (requested: ${count})`);
        
        const result = validQuestions.map(q => ({
          questionText: q.questionText || q.question,
          questionType: 'fill-in-the-blank',
          blankAnswers: q.blankAnswers || [q.correctAnswer] || [''],
          caseSensitive: q.caseSensitive !== undefined ? q.caseSensitive : false,
          explanation: q.explanation || '',
          difficulty: difficulty,
          topic: topic || 'General',
          category: 'AI-Generated',
          tags: [topic || 'ai-generated', difficulty]
        }));
        
        // Return array always (for consistency with controller)
        return result;
      } catch (parseError) {
        console.error('Fill-in-blank JSON parse error:', parseError.message);
        console.error('Cleaned response:', cleanedResponse.substring(0, 500));
        throw new Error(`Invalid JSON format: ${parseError.message}`);
      }
    } catch (error) {
      console.error('Error generating fill-in-blank:', error);
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
  async generateCodingQuestion(topic, language = 'javascript', difficulty = 'medium', count = 1, customPrompt = '') {
    let prompt;
    if (customPrompt && !topic) {
      prompt = `You are a quiz generator. Generate EXACTLY ${count} coding question(s) in ${language} based on the following requirements:

${customPrompt}

CRITICAL REQUIREMENTS:
- Generate EXACTLY ${count} question(s), no more, no less
- ${difficulty} difficulty level
- Each question MUST have a "questionText" field
- Include starter code template
- Provide test cases
- Include sample solution`;
    } else {
      const additionalInstructions = customPrompt ? `\n\nADDITIONAL REQUIREMENTS:\n${customPrompt}` : '';
      
      prompt = `You are a quiz generator. Generate EXACTLY ${count} coding question(s) about "${topic}" in ${language} with ${difficulty} difficulty.

CRITICAL REQUIREMENTS:
- Generate EXACTLY ${count} question(s), no more, no less
- ${difficulty} difficulty level
- Each question MUST have a "questionText" field
- Include starter code template
- Provide test cases
- Include sample solution${additionalInstructions}`;
    }

    prompt += `

Format as VALID JSON array with EXACTLY ${count} question(s):
[
  {
    "questionText": "Clear problem description",
    "starterCode": "function template or class skeleton",
    "testCases": ["test case 1", "test case 2"],
    "solution": "complete working solution code",
    "hints": ["hint 1", "hint 2"]
  }
]

CRITICAL - READ CAREFULLY:
- You MUST generate ONLY ${count} question(s), NOT ${count + 1} or ${count + 2} or any other number
- If asked for 5 questions, generate 5, not 9
- If asked for 2 questions, generate 2, not 9
- Count the questions in your JSON array before returning
- The array length MUST be exactly ${count}

IMPORTANT: Return ONLY the JSON array with EXACTLY ${count} questions. NO additional text, NO markdown, NO code blocks.`;

    try {
      // Use moderate temperature for coding questions
      const response = await this.generateCompletion(prompt, { temperature: 0.6 });
      const cleanedResponse = this.cleanJsonResponse(response);
      
      console.log('Coding question cleaned response preview:', cleanedResponse.substring(0, 200));
      
      try {
        const questions = JSON.parse(cleanedResponse);
        const questionsArray = Array.isArray(questions) ? questions : [questions];
        
        // Log what AI actually generated
        console.log(`Coding: AI generated ${questionsArray.length} questions (requested: ${count})`);
        
        // Validate and limit to requested count
        const validQuestions = questionsArray
          .filter(q => q.questionText || q.question)
          .slice(0, count);
        
        if (validQuestions.length === 0) {
          throw new Error('No valid coding questions were generated with questionText field');
        }
        
        // Log if AI generated more than requested
        if (questionsArray.length > count) {
          console.warn(`⚠ Coding: AI OVER-GENERATED: Generated ${questionsArray.length} but USER ASKED FOR ${count}. Returning only first ${count}.`);
        }
        
        if (validQuestions.length < count) {
          console.warn(`⚠ Coding: AI UNDER-GENERATED: Requested ${count} questions but only ${validQuestions.length} valid questions were generated`);
        }
        
        console.log(`✓ Coding: Returning exactly ${validQuestions.length} question(s) to user (requested: ${count})`);
        
        return validQuestions.map(data => ({
          questionText: data.questionText || data.question,
          questionType: 'code',
          language: language,
          starterCode: data.starterCode || '',
          testCases: data.testCases || [],
          solution: data.solution || '',
          hints: data.hints || [],
          difficulty: difficulty,
          topic: topic || 'General',
          category: 'AI-Generated',
          tags: [topic || 'ai-generated', difficulty, language]
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
        multipleChoice = 0,
        trueFalse = 0,
        coding = 0,
        fillInBlank = 0,
        sql = 0,
        essay = 0
      } = distribution;

      const totalRequested = multipleChoice + trueFalse + coding + fillInBlank + sql + essay;
      console.log(`Generating mixed questions (TOTAL: ${totalRequested}): MC=${multipleChoice}, TF=${trueFalse}, Coding=${coding}, FillInBlank=${fillInBlank}, SQL=${sql}, Essay=${essay}`);

      const results = {
        multipleChoice: [],
        trueFalse: [],
        coding: [],
        fillInBlank: [],
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
          this.generateTrueFalseQuestion(topic, difficulty, customPrompt, trueFalse)
            .then(questions => { 
              // Ensure it returns an array
              results.trueFalse = Array.isArray(questions) ? questions : [questions]; 
            })
            .catch(err => { console.error('T/F generation failed:', err); results.trueFalse = []; })
        );
      }

      // Generate coding questions
      if (coding > 0) {
        promises.push(
          this.generateCodingQuestion(topic, 'javascript', difficulty, coding, customPrompt)
            .then(questions => { results.coding = questions; })
            .catch(err => { console.error('Coding generation failed:', err); results.coding = []; })
        );
      }

      // Generate fill-in-blank questions
      if (fillInBlank > 0) {
        promises.push(
          this.generateFillInBlank(topic, difficulty, fillInBlank, customPrompt)
            .then(questions => { results.fillInBlank = questions; })
            .catch(err => { console.error('Fill-in-blank generation failed:', err); results.fillInBlank = []; })
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
