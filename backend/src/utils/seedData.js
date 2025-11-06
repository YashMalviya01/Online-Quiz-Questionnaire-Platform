const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const User = require('../models/User');
const Result = require('../models/Result');
const QuestionBank = require('../models/QuestionBank');
const EnhancedProctoringEvent = require('../models/EnhancedProctoringEvent');
const QuizAnalytics = require('../models/QuizAnalytics');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting comprehensive database seeding...');
    await Quiz.deleteMany({});
    await Question.deleteMany({});
    await User.deleteMany({});
    await Result.deleteMany({});
    await QuestionBank.deleteMany({});
    await EnhancedProctoringEvent.deleteMany({});
    await QuizAnalytics.deleteMany({});
    
    const generateMockDescriptor = (seed = 0) => {
      const descriptor = [];
      for (let i = 0; i < 128; i++) {
        descriptor.push(Math.sin(seed + i) * 0.5);
      }
      return descriptor;
    };
    
    const adminUser = await User.create({
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@quiz.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
      referenceDescriptor: generateMockDescriptor(1)
    });

    const aman = await User.create({
      username: 'aman',
      firstName: 'Aman',
      lastName: 'Singh',
      email: 'aman@student.com',
      password: 'student123',
      role: 'student',
      isVerified: true,
      referenceDescriptor: generateMockDescriptor(2)
    });

    const chetan = await User.create({
      username: 'chetan',
      firstName: 'Chetan',
      lastName: 'Patil',
      email: 'chetan@student.com',
      password: 'student123',
      role: 'student',
      isVerified: true,
      referenceDescriptor: generateMockDescriptor(3)
    });

    const vanisha = await User.create({
      username: 'vanisha',
      firstName: 'Vanisha',
      lastName: 'Sharma',
      email: 'vanisha@student.com',
      password: 'student123',
      role: 'student',
      isVerified: true,
      referenceDescriptor: generateMockDescriptor(4)
    });

    const shashank = await User.create({
      username: 'shashank',
      firstName: 'Shashank',
      lastName: 'Verma',
      email: 'shashank@student.com',
      password: 'student123',
      role: 'student',
      isVerified: true,
      referenceDescriptor: generateMockDescriptor(5)
    });

    const yash = await User.create({
      username: 'yash',
      firstName: 'Yash',
      lastName: 'Mehta',
      email: 'yash@student.com',
      password: 'student123',
      role: 'student',
      isVerified: true,
      referenceDescriptor: generateMockDescriptor(7)
    });

    const instructor = await User.create({
      username: 'instructor',
      firstName: 'John',
      lastName: 'Smith',
      email: 'instructor@quiz.com',
      password: 'instructor123',
      role: 'instructor',
      isVerified: true,
      referenceDescriptor: generateMockDescriptor(6)
    });

    const students = [aman, chetan, vanisha, shashank, yash];
    
    console.log('✅ Users created. Creating question banks...');
    
    // Create question banks
    const jsBank = await QuestionBank.create({
      name: 'JavaScript Essentials',
      description: 'Comprehensive collection of JavaScript questions covering ES6, async/await, and modern JS concepts',
      category: 'Programming',
      subject: 'JavaScript',
      tags: ['javascript', 'es6', 'programming', 'web development'],
      isPublic: true,
      owner: instructor._id,
      questions: [],
      sharedWith: []
    });

    const pythonBank = await QuestionBank.create({
      name: 'Python Fundamentals',
      description: 'Essential Python programming questions including data structures, OOP, and algorithms',
      category: 'Programming',
      subject: 'Python',
      tags: ['python', 'programming', 'data structures', 'oop'],
      isPublic: true,
      owner: instructor._id,
      questions: [],
      sharedWith: []
    });

    const mathBank = await QuestionBank.create({
      name: 'Mathematics Practice',
      description: 'Math questions covering algebra, geometry, and arithmetic',
      category: 'Mathematics',
      subject: 'General Math',
      tags: ['math', 'algebra', 'geometry', 'arithmetic'],
      isPublic: true,
      owner: instructor._id,
      questions: [],
      sharedWith: []
    });

    console.log('✅ Question banks created. Creating comprehensive quiz with all 7 question types...');
    
    const createQuizWithQuestions = async (quizPayload, questionPayloads) => {
      const quiz = await Quiz.create(quizPayload);
      const questions = await Question.insertMany(
        questionPayloads.map((question) => ({
          ...question,
          quiz: quiz._id,
          createdBy: instructor._id
        }))
      );

      quiz.questions = questions.map((q) => q._id);
      await quiz.save();

      return { quiz, questions };
    };

    const comprehensiveQuizPayload = {
      title: 'Comprehensive Assessment - Modern Web Concepts',
      description: 'Demonstrates a mix of theoretical and practical questions across modern web development topics.',
      timeLimit: 45,
      maxAttempts: 3,
      expiryDate: null,
      isPublished: true,
      createdBy: instructor._id,
      randomizeQuestions: true,
      randomizeOptions: true,
      enableEyeTracking: true,
      enableAudioMonitoring: true,
      enableScreenRecording: true,
      enableBrowserLockdown: true,
      enableFaceDetection: true,
      passingScore: 70,
      allowPartialCredit: true,
      showCorrectAnswers: true,
      showFeedback: true
    };

    const { quiz: comprehensiveQuiz, questions: comprehensiveQuestions } = await createQuizWithQuestions(
      comprehensiveQuizPayload,
      [
        {
          questionText: 'What is the result of typeof null in JavaScript?',
          questionType: 'multiple-choice',
          options: ['object', 'null', 'undefined', 'number'],
          correctAnswer: 'object',
          maxScore: 5,
          category: 'JavaScript',
          tags: ['javascript', 'basics'],
          difficulty: 'easy'
        },
        {
          questionText: 'Write a JavaScript function that returns the sum of two numbers.',
          questionType: 'code',
          codeLanguage: 'javascript',
          starterCode: 'function sum(a, b) {\n  // Write your code here\n}',
          referenceSolution: 'function sum(a, b) { return a + b; }',
          maxScore: 10,
          evaluationNotes: 'Award full marks if the solution handles numeric inputs and returns their sum.'
        },
        {
          questionText: 'Fill in the blank: The keyword ____ allows redeclaration and hoisting without block scope in JavaScript.',
          questionType: 'fill-in-blank',
          blankAnswers: ['var'],
          caseSensitive: false,
          maxScore: 4,
          partialCredit: false,
          category: 'JavaScript',
          tags: ['javascript', 'scope'],
          difficulty: 'medium'
        },
        {
          questionText: 'Match the HTTP status codes to their meaning.',
          questionType: 'matching',
          matchingPairs: [
            { left: '200', right: 'OK' },
            { left: '301', right: 'Moved Permanently' },
            { left: '404', right: 'Not Found' }
          ],
          maxScore: 6,
          partialCredit: true,
          category: 'Web',
          tags: ['http', 'web'],
          difficulty: 'medium'
        },
        {
          questionText: 'Describe how event delegation works in the browser and when you would use it.',
          questionType: 'essay',
          wordLimit: 250,
          rubric: 'Thesis|Evidence|Clarity',
          sampleAnswer:
            'Event delegation leverages event bubbling by attaching a single handler to a parent element. As events bubble up, the handler inspects the event target to react to matching child elements, reducing listeners and improving performance for dynamic lists.',
          maxScore: 8,
          category: 'JavaScript',
          tags: ['javascript', 'dom'],
          difficulty: 'medium'
        },
        {
          questionText: 'Upload a short PDF explaining how you would secure a REST API (2-3 paragraphs).',
          questionType: 'file-upload',
          allowedFileTypes: ['pdf', 'docx'],
          maxFileSize: 10,
          maxScore: 8,
          category: 'Security',
          tags: ['api', 'security'],
          difficulty: 'hard'
        }
      ]
    );

    const jsFundamentalsQuizPayload = {
      title: 'JavaScript Fundamentals Quiz',
      description: 'Warm-up quiz that focuses on ES6+ features and core language concepts.',
      timeLimit: 30,
      maxAttempts: 2,
      expiryDate: null,
      isPublished: true,
      createdBy: instructor._id,
      randomizeQuestions: true,
      randomizeOptions: true,
      enableEyeTracking: false,
      enableAudioMonitoring: false,
      enableScreenRecording: false,
      enableBrowserLockdown: false,
      enableFaceDetection: false,
      passingScore: 60,
      allowPartialCredit: true,
      showCorrectAnswers: true,
      showFeedback: true
    };

    const { quiz: jsFundamentalsQuiz, questions: jsFundamentalsQuestions } = await createQuizWithQuestions(
      jsFundamentalsQuizPayload,
      [
        {
          questionText: 'Which array method creates a new array with elements that pass the provided test function?',
          questionType: 'multiple-choice',
          options: ['map', 'filter', 'reduce', 'forEach'],
          correctAnswer: 'filter',
          maxScore: 4,
          category: 'JavaScript',
          tags: ['arrays'],
          difficulty: 'easy'
        },
        {
          questionText: 'Which statement about const declarations is true?',
          questionType: 'multiple-choice',
          options: [
            'const variables can be reassigned to a new value',
            'const variables create block scope bindings',
            'const variables are hoisted and initialized with undefined',
            'const declarations must always reference primitive values'
          ],
          correctAnswer: 'const variables create block scope bindings',
          maxScore: 4,
          category: 'JavaScript',
          tags: ['variables'],
          difficulty: 'medium'
        },
        {
          questionText: 'Fill in the blank: The ___ operator spreads the elements of an iterable into individual elements.',
          questionType: 'fill-in-blank',
          blankAnswers: ['spread'],
          caseSensitive: false,
          maxScore: 3,
          partialCredit: false,
          category: 'JavaScript',
          tags: ['syntax'],
          difficulty: 'easy'
        },
        {
          questionText: 'Write an arrow function named square that returns the square of its argument.',
          questionType: 'code',
          codeLanguage: 'javascript',
          starterCode: 'const square = (n) => {\n  // TODO: return the square\n};',
          referenceSolution: 'const square = (n) => n * n;',
          maxScore: 6,
          evaluationNotes: 'Allow equivalent implementations that correctly square the input.'
        }
      ]
    );

    const pythonBasicsQuizPayload = {
      title: 'Python Basics Assessment',
      description: 'Covers Python syntax, data structures, and control flow for beginners.',
      timeLimit: 35,
      maxAttempts: 2,
      expiryDate: null,
      isPublished: true,
      createdBy: instructor._id,
      randomizeQuestions: true,
      randomizeOptions: true,
      enableEyeTracking: false,
      enableAudioMonitoring: false,
      enableScreenRecording: false,
      enableBrowserLockdown: false,
      enableFaceDetection: false,
      passingScore: 65,
      allowPartialCredit: true,
      showCorrectAnswers: true,
      showFeedback: true
    };

    const { quiz: pythonBasicsQuiz, questions: pythonBasicsQuestions } = await createQuizWithQuestions(
      pythonBasicsQuizPayload,
      [
        {
          questionText: 'What is the output of len({"a": 1, "b": 2, "c": 3})?',
          questionType: 'multiple-choice',
          options: ['1', '2', '3', 'Error'],
          correctAnswer: '3',
          maxScore: 3,
          category: 'Python',
          tags: ['dictionaries'],
          difficulty: 'easy'
        },
        {
          questionText: 'Which keyword is used to handle exceptions in Python?',
          questionType: 'multiple-choice',
          options: ['catch', 'except', 'handle', 'error'],
          correctAnswer: 'except',
          maxScore: 3,
          category: 'Python',
          tags: ['exceptions'],
          difficulty: 'easy'
        },
        {
          questionText: 'Fill in the blank: The built-in function ___ converts an iterable into a list of tuples, pairing elements by position.',
          questionType: 'fill-in-blank',
          blankAnswers: ['zip'],
          caseSensitive: false,
          maxScore: 3,
          partialCredit: false,
          category: 'Python',
          tags: ['built-ins'],
          difficulty: 'medium'
        },
        {
          questionText: 'Write a Python function that returns True if a number is even and False otherwise.',
          questionType: 'code',
          codeLanguage: 'python',
          starterCode: 'def is_even(n):\n    # TODO: return True or False\n    pass',
          referenceSolution: 'def is_even(n):\n    return n % 2 == 0',
          maxScore: 6,
          evaluationNotes: 'Accept solutions that correctly determine even numbers and return booleans.'
        }
      ]
    );

    const mathDrillQuizPayload = {
      title: 'Quantitative Reasoning Drill',
      description: 'A focused practice set covering algebra, arithmetic, and geometry fundamentals.',
      timeLimit: 25,
      maxAttempts: 2,
      expiryDate: null,
      isPublished: true,
      createdBy: instructor._id,
      randomizeQuestions: true,
      randomizeOptions: true,
      enableEyeTracking: false,
      enableAudioMonitoring: false,
      enableScreenRecording: false,
      enableBrowserLockdown: false,
      enableFaceDetection: false,
      passingScore: 65,
      allowPartialCredit: true,
      showCorrectAnswers: true,
      showFeedback: true
    };

    const { quiz: mathDrillQuiz, questions: mathDrillQuestions } = await createQuizWithQuestions(
      mathDrillQuizPayload,
      [
        {
          questionText: 'What is the derivative of x^2?',
          questionType: 'multiple-choice',
          options: ['x', '2x', 'x^3', '2'],
          correctAnswer: '2x',
          maxScore: 3,
          category: 'Mathematics',
          tags: ['calculus'],
          difficulty: 'medium'
        },
        {
          questionText: 'What is the value of 3! (3 factorial)?',
          questionType: 'multiple-choice',
          options: ['3', '6', '9', '12'],
          correctAnswer: '6',
          maxScore: 2,
          category: 'Mathematics',
          tags: ['arithmetic'],
          difficulty: 'easy'
        },
        {
          questionText: 'Solve for x: 2x + 3 = 11',
          questionType: 'fill-in-blank',
          blankAnswers: ['4'],
          caseSensitive: false,
          maxScore: 3,
          partialCredit: false,
          category: 'Mathematics',
          tags: ['algebra'],
          difficulty: 'easy'
        },
        {
          questionText: 'Match each shape to its formula for area.',
          questionType: 'matching',
          matchingPairs: [
            { left: 'Triangle', right: '1/2 × base × height' },
            { left: 'Circle', right: 'π × r²' },
            { left: 'Rectangle', right: 'length × width' }
          ],
          maxScore: 4,
          partialCredit: true,
          category: 'Mathematics',
          tags: ['geometry'],
          difficulty: 'medium'
        }
      ]
    );

    // Create AI-generated sample questions
    const aiGeneratedQuestions = await Question.create([
      {
        questionText: 'What is the main purpose of React Hooks?',
        questionType: 'multiple-choice',
        options: [
          'To replace class components with functional components',
          'To manage state and side effects in functional components',
          'To create custom HTML elements',
          'To optimize performance automatically'
        ],
        correctAnswer: 'To manage state and side effects in functional components',
        maxScore: 5,
        category: 'React',
        tags: ['react', 'hooks', 'frontend'],
        difficulty: 'medium',
        aiGenerated: {
          isAIGenerated: true,
          aiSource: 'gemini-pro',
          generationDate: new Date(),
          topic: 'React Hooks',
          confidence: 0.92,
          humanReviewed: true,
          reviewedBy: adminUser._id,
          reviewDate: new Date(),
          qualityScore: 88,
          improvementSuggestions: []
        }
      },
      {
        questionText: 'Write a Python function that checks if a string is a palindrome.',
        questionType: 'code',
        codeLanguage: 'python',
        starterCode: 'def is_palindrome(s):\n    # Write your code here\n    pass',
        referenceSolution: 'def is_palindrome(s):\n    return s == s[::-1]',
        maxScore: 10,
        evaluationNotes: 'Should handle case sensitivity and spaces properly.',
        category: 'Python',
        tags: ['python', 'algorithms', 'strings'],
        difficulty: 'easy',
        aiGenerated: {
          isAIGenerated: true,
          aiSource: 'gemini-pro',
          generationDate: new Date(),
          topic: 'Python String Manipulation',
          confidence: 0.95,
          humanReviewed: false,
          qualityScore: 90,
          improvementSuggestions: ['Consider adding test cases for edge cases']
        }
      },
      {
        questionText: 'Explain the difference between REST and GraphQL APIs in your own words.',
        questionType: 'essay',
        wordLimit: 200,
        rubric: 'Understanding|Clarity|Examples',
        sampleAnswer: 'REST uses multiple endpoints with fixed data structures, while GraphQL uses a single endpoint where clients specify exactly what data they need. GraphQL reduces over-fetching but has a steeper learning curve.',
        maxScore: 8,
        category: 'API Design',
        tags: ['api', 'rest', 'graphql'],
        difficulty: 'hard',
        aiGenerated: {
          isAIGenerated: true,
          aiSource: 'gemini-pro',
          generationDate: new Date(),
          topic: 'API Design Patterns',
          confidence: 0.88,
          humanReviewed: true,
          reviewedBy: adminUser._id,
          reviewDate: new Date(),
          qualityScore: 85,
          improvementSuggestions: []
        }
      }
    ]);

    console.log('✅ AI-generated questions created');

    // Attach questions to banks
    jsBank.questions.push(
      ...comprehensiveQuestions
        .filter((question) => question.category === 'JavaScript' || question.category === 'Web')
        .map((question) => question._id),
      ...jsFundamentalsQuestions.map((question) => question._id),
      aiGeneratedQuestions[0]._id // Add React question to JS bank
    );
    await jsBank.save();

    pythonBank.questions.push(
      ...pythonBasicsQuestions.map((question) => question._id),
      aiGeneratedQuestions[1]._id // Add Python question
    );
    await pythonBank.save();

    mathBank.questions.push(...mathDrillQuestions.map((question) => question._id));
    await mathBank.save();

    console.log('✅ Quizzes and questions created. Generating sample results...');

    const buildAnswers = (questionDocs, answerMap) =>
      questionDocs.map((question) => {
        const base = {
          questionId: question._id,
          questionType: question.questionType,
          maxScore: question.maxScore,
          needsGrading: question.questionType === 'essay' || question.questionType === 'file-upload'
        };

        const overrides = answerMap[question._id.toString()] || {};
        return { ...base, ...overrides };
      });

    const summarize = (answers) => {
      const pointsEarned = answers.reduce((sum, answer) => sum + (answer.awardedScore || 0), 0);
      const totalScore = answers.reduce((sum, answer) => sum + (answer.maxScore || 0), 0);
      const score = totalScore > 0 ? Math.round((pointsEarned / totalScore) * 100) : 0;
      const requiresManualReview = answers.some((answer) => answer.needsGrading);

      return {
        pointsEarned,
        totalScore,
        autoScore: pointsEarned,
        autoMaxScore: totalScore,
        score,
        requiresManualReview,
        status: requiresManualReview ? 'submitted' : 'completed'
      };
    };

    const comprehensiveAnswerSets = [
      buildAnswers(comprehensiveQuestions, {
        [comprehensiveQuestions[0]._id.toString()]: {
          selectedOption: 'object',
          awardedScore: 5,
          isCorrect: true,
          needsGrading: false
        },
        [comprehensiveQuestions[1]._id.toString()]: {
          textAnswer: 'function sum(a, b) { return a + b; }',
          awardedScore: 10,
          isCorrect: true,
          needsGrading: false,
          aiDetection: {
            analyzed: true,
            aiScore: 15,
            compositeScore: 18,
            isAIGenerated: false,
            confidence: 0.82,
            indicators: [
              { type: 'commentRatio', severity: 'low', message: 'Low comment density detected' }
            ],
            recommendation: 'human_written',
            detailedAnalysis: {
              commentRatio: { score: 10, percentage: 0 },
              variableNaming: { score: 20, averageLength: 3 },
              boilerplate: { score: 15 },
              gptFingerprints: { score: 10 }
            },
            analyzedAt: new Date()
          }
        },
        [comprehensiveQuestions[2]._id.toString()]: {
          textAnswer: 'var',
          blankAnswers: ['var'],
          awardedScore: 4,
          isCorrect: true,
          needsGrading: false
        },
        [comprehensiveQuestions[3]._id.toString()]: {
          matchingAnswers: [
            { left: '200', right: 'OK' },
            { left: '301', right: 'Moved Permanently' },
            { left: '404', right: 'Not Found' }
          ],
          awardedScore: 6,
          isCorrect: true,
          needsGrading: false
        },
        [comprehensiveQuestions[4]._id.toString()]: {
          textAnswer: 'Event delegation uses bubbling so you can register one handler on a parent for all children.',
          awardedScore: 0,
          isCorrect: false,
          needsGrading: true
        },
        [comprehensiveQuestions[5]._id.toString()]: {
          uploadedFiles: [
            {
              filename: 'api-security.pdf',
              fileUrl: 'https://example.com/api-security.pdf',
              fileSize: 1024 * 1024 * 2,
              fileType: 'pdf',
              uploadedAt: new Date()
            }
          ],
          awardedScore: 0,
          isCorrect: false,
          needsGrading: true
        }
      }),
      buildAnswers(comprehensiveQuestions, {
        [comprehensiveQuestions[0]._id.toString()]: {
          selectedOption: 'undefined',
          awardedScore: 0,
          isCorrect: false,
          needsGrading: false
        },
        [comprehensiveQuestions[1]._id.toString()]: {
          textAnswer: 'function sum(a, b){ return a + b; }',
          awardedScore: 10,
          isCorrect: true,
          needsGrading: false
        },
        [comprehensiveQuestions[2]._id.toString()]: {
          textAnswer: 'var',
          blankAnswers: ['var'],
          awardedScore: 4,
          isCorrect: true,
          needsGrading: false
        },
        [comprehensiveQuestions[3]._id.toString()]: {
          matchingAnswers: [
            { left: '200', right: 'OK' },
            { left: '301', right: 'Not Found' },
            { left: '404', right: 'Moved Permanently' }
          ],
          awardedScore: 2,
          isCorrect: false,
          needsGrading: false
        },
        [comprehensiveQuestions[4]._id.toString()]: {
          textAnswer: 'It lets you listen once on the parent and catch bubbling events from children.',
          awardedScore: 0,
          isCorrect: false,
          needsGrading: true
        },
        [comprehensiveQuestions[5]._id.toString()]: {
          uploadedFiles: [],
          awardedScore: 0,
          isCorrect: false,
          needsGrading: true
        }
      })
    ];

    const jsFundamentalsAnswerSets = [
      buildAnswers(jsFundamentalsQuestions, {
        [jsFundamentalsQuestions[0]._id.toString()]: {
          selectedOption: 'filter',
          awardedScore: 4,
          isCorrect: true,
          needsGrading: false
        },
        [jsFundamentalsQuestions[1]._id.toString()]: {
          selectedOption: 'const variables create block scope bindings',
          awardedScore: 4,
          isCorrect: true,
          needsGrading: false
        },
        [jsFundamentalsQuestions[2]._id.toString()]: {
          textAnswer: 'spread',
          blankAnswers: ['spread'],
          awardedScore: 3,
          isCorrect: true,
          needsGrading: false
        },
        [jsFundamentalsQuestions[3]._id.toString()]: {
          textAnswer: '// This function takes a number and returns its square\nconst square = (number) => {\n  // Calculate the square by multiplying the number by itself\n  const result = number * number;\n  // Return the calculated result\n  return result;\n};',
          awardedScore: 6,
          isCorrect: true,
          needsGrading: false,
          aiDetection: {
            analyzed: true,
            aiScore: 75,
            compositeScore: 72,
            isAIGenerated: true,
            confidence: 0.91,
            indicators: [
              { type: 'excessiveComments', severity: 'high', message: 'Unusually high comment density' },
              { type: 'verboseNaming', severity: 'medium', message: 'Overly descriptive variable names' },
              { type: 'boilerplate', severity: 'medium', message: 'Boilerplate patterns detected' }
            ],
            recommendation: 'review_required',
            detailedAnalysis: {
              commentRatio: { score: 80, percentage: 45 },
              variableNaming: { score: 70, averageLength: 8 },
              boilerplate: { score: 65 },
              gptFingerprints: { score: 85 }
            },
            analyzedAt: new Date()
          }
        }
      }),
      buildAnswers(jsFundamentalsQuestions, {
        [jsFundamentalsQuestions[0]._id.toString()]: {
          selectedOption: 'map',
          awardedScore: 0,
          isCorrect: false,
          needsGrading: false
        },
        [jsFundamentalsQuestions[1]._id.toString()]: {
          selectedOption: 'const variables are hoisted and initialized with undefined',
          awardedScore: 0,
          isCorrect: false,
          needsGrading: false
        },
        [jsFundamentalsQuestions[2]._id.toString()]: {
          textAnswer: 'spread',
          blankAnswers: ['spread'],
          awardedScore: 3,
          isCorrect: true,
          needsGrading: false
        },
        [jsFundamentalsQuestions[3]._id.toString()]: {
          textAnswer: 'const square = (n) => n ** 2;',
          awardedScore: 6,
          isCorrect: true,
          needsGrading: false
        }
      })
    ];

    const pythonBasicsAnswerSets = [
      buildAnswers(pythonBasicsQuestions, {
        [pythonBasicsQuestions[0]._id.toString()]: {
          selectedOption: '3',
          awardedScore: 3,
          isCorrect: true,
          needsGrading: false
        },
        [pythonBasicsQuestions[1]._id.toString()]: {
          selectedOption: 'except',
          awardedScore: 3,
          isCorrect: true,
          needsGrading: false
        },
        [pythonBasicsQuestions[2]._id.toString()]: {
          textAnswer: 'zip',
          blankAnswers: ['zip'],
          awardedScore: 3,
          isCorrect: true,
          needsGrading: false
        },
        [pythonBasicsQuestions[3]._id.toString()]: {
          textAnswer: 'def is_even(n):\n    return n % 2 == 0',
          awardedScore: 6,
          isCorrect: true,
          needsGrading: false
        }
      }),
      buildAnswers(pythonBasicsQuestions, {
        [pythonBasicsQuestions[0]._id.toString()]: {
          selectedOption: '2',
          awardedScore: 0,
          isCorrect: false,
          needsGrading: false
        },
        [pythonBasicsQuestions[1]._id.toString()]: {
          selectedOption: 'except',
          awardedScore: 3,
          isCorrect: true,
          needsGrading: false
        },
        [pythonBasicsQuestions[2]._id.toString()]: {
          textAnswer: 'enumerate',
          blankAnswers: ['enumerate'],
          awardedScore: 0,
          isCorrect: false,
          needsGrading: false
        },
        [pythonBasicsQuestions[3]._id.toString()]: {
          textAnswer: 'def is_even(n):\n    return n % 2 == 0',
          awardedScore: 6,
          isCorrect: true,
          needsGrading: false
        }
      })
    ];

    const mathDrillAnswerSets = [
      buildAnswers(mathDrillQuestions, {
        [mathDrillQuestions[0]._id.toString()]: {
          selectedOption: '2x',
          awardedScore: 3,
          isCorrect: true,
          needsGrading: false
        },
        [mathDrillQuestions[1]._id.toString()]: {
          selectedOption: '6',
          awardedScore: 2,
          isCorrect: true,
          needsGrading: false
        },
        [mathDrillQuestions[2]._id.toString()]: {
          textAnswer: '4',
          blankAnswers: ['4'],
          awardedScore: 3,
          isCorrect: true,
          needsGrading: false
        },
        [mathDrillQuestions[3]._id.toString()]: {
          matchingAnswers: [
            { left: 'Triangle', right: '1/2 × base × height' },
            { left: 'Circle', right: 'π × r²' },
            { left: 'Rectangle', right: 'length × width' }
          ],
          awardedScore: 4,
          isCorrect: true,
          needsGrading: false
        }
      }),
      buildAnswers(mathDrillQuestions, {
        [mathDrillQuestions[0]._id.toString()]: {
          selectedOption: '2',
          awardedScore: 0,
          isCorrect: false,
          needsGrading: false
        },
        [mathDrillQuestions[1]._id.toString()]: {
          selectedOption: '6',
          awardedScore: 2,
          isCorrect: true,
          needsGrading: false
        },
        [mathDrillQuestions[2]._id.toString()]: {
          textAnswer: '4',
          blankAnswers: ['4'],
          awardedScore: 3,
          isCorrect: true,
          needsGrading: false
        },
        [mathDrillQuestions[3]._id.toString()]: {
          matchingAnswers: [
            { left: 'Triangle', right: '1/2 × base × height' },
            { left: 'Circle', right: 'length × width' },
            { left: 'Rectangle', right: 'π × r²' }
          ],
          awardedScore: 2,
          isCorrect: false,
          needsGrading: false
        }
      })
    ];

    const resultsPayload = [
      {
        quiz: comprehensiveQuiz._id,
        user: students[0]._id,
        answers: comprehensiveAnswerSets[0],
        ...summarize(comprehensiveAnswerSets[0]),
        manuallyGraded: false,
        timeTaken: 1800,
        submittedAt: new Date()
      },
      {
        quiz: comprehensiveQuiz._id,
        user: students[1]._id,
        answers: comprehensiveAnswerSets[1],
        ...summarize(comprehensiveAnswerSets[1]),
        manuallyGraded: false,
        timeTaken: 2100,
        submittedAt: new Date()
      },
      {
        quiz: jsFundamentalsQuiz._id,
        user: students[2]._id,
        answers: jsFundamentalsAnswerSets[0],
        ...summarize(jsFundamentalsAnswerSets[0]),
        manuallyGraded: false,
        timeTaken: 900,
        submittedAt: new Date()
      },
      {
        quiz: jsFundamentalsQuiz._id,
        user: students[3]._id,
        answers: jsFundamentalsAnswerSets[1],
        ...summarize(jsFundamentalsAnswerSets[1]),
        manuallyGraded: false,
        timeTaken: 1200,
        submittedAt: new Date()
      },
      {
        quiz: pythonBasicsQuiz._id,
        user: students[4]._id,
        answers: pythonBasicsAnswerSets[0],
        ...summarize(pythonBasicsAnswerSets[0]),
        manuallyGraded: false,
        timeTaken: 1100,
        submittedAt: new Date()
      },
      {
        quiz: pythonBasicsQuiz._id,
        user: students[0]._id,
        answers: pythonBasicsAnswerSets[1],
        ...summarize(pythonBasicsAnswerSets[1]),
        manuallyGraded: false,
        timeTaken: 1250,
        submittedAt: new Date()
      },
      {
        quiz: mathDrillQuiz._id,
        user: students[1]._id,
        answers: mathDrillAnswerSets[0],
        ...summarize(mathDrillAnswerSets[0]),
        manuallyGraded: false,
        timeTaken: 800,
        submittedAt: new Date()
      },
      {
        quiz: mathDrillQuiz._id,
        user: students[2]._id,
        answers: mathDrillAnswerSets[1],
        ...summarize(mathDrillAnswerSets[1]),
        manuallyGraded: false,
        timeTaken: 950,
        submittedAt: new Date()
      }
    ];

    const results = await Result.create(resultsPayload);

    console.log(`✅ Sample results created (${results.length} total)! Recalculating analytics...`);

    const analyticsDocs = await QuizAnalytics.create([
      { quiz: comprehensiveQuiz._id },
      { quiz: jsFundamentalsQuiz._id },
      { quiz: pythonBasicsQuiz._id },
      { quiz: mathDrillQuiz._id }
    ]);

    for (const doc of analyticsDocs) {
      await doc.recalculate();
      await doc.save();
    }

    console.log('📈 Quiz analytics refreshed.');

    console.log('');
    console.log('='.repeat(70));
    console.log('🎉 SEED DATA LOADED SUCCESSFULLY!');
    console.log('='.repeat(70));
    console.log('');
    console.log('👥 USERS (7 total):');
    console.log('   Admin:      admin@quiz.com / admin123');
    console.log('   Instructor: instructor@quiz.com / instructor123');
    console.log('   Students:   aman|chetan|vanisha|shashank|yash@student.com / student123');
    console.log('');
    console.log('📚 QUESTION BANKS (3 total):');
    console.log('   • JavaScript Essentials (Programming/JavaScript)');
    console.log('   • Python Fundamentals (Programming/Python)');
    console.log('   • Mathematics Practice (Mathematics/General Math)');
    console.log('');
  console.log('📝 QUIZZES CREATED (4 total):');
  console.log('   • Comprehensive Assessment - Modern Web Concepts (6 questions, enhanced proctoring)');
  console.log('   • JavaScript Fundamentals Quiz (4 questions, ES6 focus)');
  console.log('   • Python Basics Assessment (4 questions, beginner friendly)');
  console.log('   • Quantitative Reasoning Drill (4 questions, math practice)');
    console.log('');
  console.log('❓ QUESTIONS (18 total):');
    console.log('   • Mix of multiple-choice, code, fill-in-the-blank, matching, essay, and file upload items');
    console.log('');
  console.log('📊 SAMPLE RESULTS (8 total):');
    console.log('   • Demonstrates completed attempts and submissions awaiting manual grading');
    console.log('   • Quiz analytics pre-populated for dashboard visualisations');
    console.log('');
    console.log('='.repeat(70));
    console.log('✨ Ready for testing! Visit http://localhost:3000');
    console.log('='.repeat(70));

    return {
      success: true,
      message: 'Demo data loaded successfully!',
      data: {
        users: 7,
        questionBanks: 3,
        quizzes: 4,
        questions: 18,
        results: results.length
      }
    };
  } catch (error) {
    console.error('Error seeding:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  const mongoose = require('mongoose');
  require('dotenv').config();
  
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB for seeding');
      return seedDatabase();
    })
    .then((result) => {
      console.log('\n✓ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('✗ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;
