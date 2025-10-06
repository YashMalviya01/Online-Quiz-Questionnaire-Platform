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

    const alice = await User.create({
      username: 'alice',
      firstName: 'Alice',
      lastName: 'Brown',
      email: 'alice@student.com',
      password: 'student123',
      role: 'student',
      isVerified: true,
      referenceDescriptor: generateMockDescriptor(2)
    });

    const bob = await User.create({
      username: 'bob',
      firstName: 'Bob',
      lastName: 'Wilson',
      email: 'bob@student.com',
      password: 'student123',
      role: 'student',
      isVerified: true,
      referenceDescriptor: generateMockDescriptor(3)
    });

    const charlie = await User.create({
      username: 'charlie',
      firstName: 'Charlie',
      lastName: 'Davis',
      email: 'charlie@student.com',
      password: 'student123',
      role: 'student',
      isVerified: true,
      referenceDescriptor: generateMockDescriptor(4)
    });

    const diana = await User.create({
      username: 'diana',
      firstName: 'Diana',
      lastName: 'Martinez',
      email: 'diana@student.com',
      password: 'student123',
      role: 'student',
      isVerified: true,
      referenceDescriptor: generateMockDescriptor(5)
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

    const students = [alice, bob, charlie, diana];
    
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
    
    // Quiz 1: Comprehensive Assessment (All 7 Question Types + Enhanced Proctoring)
    const comprehensiveQuiz = await Quiz.create({
      title: 'Comprehensive Assessment - All Question Types',
      description: 'This quiz demonstrates all 7 question types with enhanced proctoring, adaptive testing, and question pools',
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
    });

    const comprehensiveQuestions = await Question.insertMany([
      // 1. Multiple Choice
      {
        quiz: comprehensiveQuiz._id,
        questionText: 'What is the result of typeof null in JavaScript?',
        questionType: 'multiple-choice',
        options: ['object', 'null', 'undefined', 'number'],
        correctAnswer: 'object',
        maxScore: 5
      },
      // 2. Code
      {
        quiz: comprehensiveQuiz._id,
        questionText: 'Write a JavaScript function that returns the sum of two numbers',
        questionType: 'code',
        codeLanguage: 'javascript',
        starterCode: 'function sum(a, b) {\n  // Write your code here\n}',
        correctAnswer: 'function sum(a, b) { return a + b; }',
        options: [],
        maxScore: 10
      }
    ]);

    comprehensiveQuiz.questions = comprehensiveQuestions.map(q => q._id);
    await comprehensiveQuiz.save();

    // Add questions to appropriate question banks
    jsBank.questions.push(
      comprehensiveQuestions[0]._id, // Multiple choice
      comprehensiveQuestions[1]._id  // Code
    );
    await jsBank.save();

    console.log('✅ Comprehensive quiz created. Creating sample results...');

    // Create sample results with various scores
    const results = await Result.create([
      {
        quiz: comprehensiveQuiz._id,
        user: students[0]._id,
        answers: [
          { questionId: comprehensiveQuestions[0]._id, answer: 'null', isCorrect: false, score: 0 },
          { questionId: comprehensiveQuestions[1]._id, answer: 'function sum(a, b) { return a + b; }', isCorrect: true, score: 10 }
        ],
        score: 10,
        percentage: 66.7,
        passed: false,
        timeTaken: 15,
        submittedAt: new Date()
      },
      {
        quiz: comprehensiveQuiz._id,
        user: students[1]._id,
        answers: [
          { questionId: comprehensiveQuestions[0]._id, answer: 'object', isCorrect: true, score: 5 },
          { questionId: comprehensiveQuestions[1]._id, answer: 'function sum(a, b) { return a + b; }', isCorrect: true, score: 10 }
        ],
        score: 15,
        percentage: 100.0,
        passed: true,
        timeTaken: 12,
        submittedAt: new Date()
      },
      {
        quiz: comprehensiveQuiz._id,
        user: students[2]._id,
        answers: [
          { questionId: comprehensiveQuestions[0]._id, answer: 'object', isCorrect: true, score: 5 },
          { questionId: comprehensiveQuestions[1]._id, answer: 'function sum(a, b) { return a + b; }', isCorrect: true, score: 10 }
        ],
        score: 15,
        percentage: 100.0,
        passed: true,
        timeTaken: 10,
        submittedAt: new Date()
      }
    ]);

    console.log('✅ Sample results created!');

    console.log('');
    console.log('='.repeat(70));
    console.log('🎉 SEED DATA LOADED SUCCESSFULLY!');
    console.log('='.repeat(70));
    console.log('');
    console.log('👥 USERS (6 total):');
    console.log('   Admin:      admin@quiz.com / admin123');
    console.log('   Instructor: instructor@quiz.com / instructor123');
    console.log('   Students:   alice|bob|charlie|diana@student.com / student123');
    console.log('');
    console.log('📚 QUESTION BANKS (3 total):');
    console.log('   • JavaScript Essentials (Programming/JavaScript)');
    console.log('   • Python Fundamentals (Programming/Python)');
    console.log('   • Mathematics Practice (Mathematics/General Math)');
    console.log('');
    console.log('📝 QUIZ CREATED (1 total):');
    console.log('   Title: JavaScript Fundamentals');
    console.log('   • 2 questions (Multiple Choice + Code)');
    console.log('   • Enhanced proctoring enabled');
    console.log('   • 45 min time limit, 3 attempts max');
    console.log('   • Passing score: 70%');
    console.log('');
    console.log('❓ QUESTIONS (2 total):');
    console.log('   1. Multiple Choice: "What is typeof null?" (5 points)');
    console.log('   2. Code: "Write sum function" (10 points)');
    console.log('');
    console.log('📊 SAMPLE RESULTS (3 total):');
    console.log('   • Alice: 66.7% (Failed)');
    console.log('   • Bob: 100% (Passed)');
    console.log('   • Charlie: 100% (Passed)');
    console.log('');
    console.log('='.repeat(70));
    console.log('✨ Ready for testing! Visit http://localhost:3000');
    console.log('='.repeat(70));
    
    return { 
      success: true, 
      message: 'Demo data loaded successfully!',
      data: { 
        users: 6, 
        questionBanks: 3,
        quizzes: 1, 
        questions: 2,
        results: 3
      }
    };
  } catch (error) {
    console.error('Error seeding:', error);
    throw error;
  }
};

module.exports = seedDatabase;
