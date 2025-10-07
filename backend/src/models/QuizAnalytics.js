const mongoose = require('mongoose');

const quizAnalyticsSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      unique: true,
      index: true
    },
    
    // Overall Statistics
    totalAttempts: {
      type: Number,
      default: 0
    },
    completedAttempts: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    highestScore: {
      type: Number,
      default: 0
    },
    lowestScore: {
      type: Number,
      default: 0
    },
    medianScore: {
      type: Number,
      default: 0
    },
    standardDeviation: {
      type: Number,
      default: 0
    },
    
    // Time Analytics
    averageCompletionTime: {
      type: Number,
      default: 0 // in seconds
    },
    fastestCompletion: {
      type: Number,
      default: 0
    },
    slowestCompletion: {
      type: Number,
      default: 0
    },
    
    // Score Distribution
    scoreDistribution: {
      '0-20': { type: Number, default: 0 },
      '21-40': { type: Number, default: 0 },
      '41-60': { type: Number, default: 0 },
      '61-80': { type: Number, default: 0 },
      '81-100': { type: Number, default: 0 }
    },
    
    // Grade Distribution
    gradeDistribution: {
      'A': { type: Number, default: 0 },
      'B': { type: Number, default: 0 },
      'C': { type: Number, default: 0 },
      'D': { type: Number, default: 0 },
      'F': { type: Number, default: 0 }
    },
    
    // Question-Level Analytics
    questionAnalytics: [{
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
      },
      questionText: String,
      
      // Performance metrics
      totalResponses: {
        type: Number,
        default: 0
      },
      correctResponses: {
        type: Number,
        default: 0
      },
      incorrectResponses: {
        type: Number,
        default: 0
      },
      successRate: {
        type: Number,
        default: 0 // percentage
      },
      
      // Time metrics
      averageTimeSpent: {
        type: Number,
        default: 0 // in seconds
      },
      
      // Difficulty assessment
      perceivedDifficulty: {
        type: String,
        enum: ['very-easy', 'easy', 'medium', 'hard', 'very-hard'],
        default: 'medium'
      },
      discriminationIndex: {
        type: Number,
        default: 0 // -1 to 1
      },
      
      // Answer distribution (for multiple choice)
      answerDistribution: {
        type: Map,
        of: Number
      },
      
      // Common mistakes
      commonMistakes: [{
        answer: String,
        count: Number,
        percentage: Number
      }]
    }],
    
    // Student Performance Trends
    performanceTrends: [{
      date: Date,
      averageScore: Number,
      attemptCount: Number
    }],
    
    // At-Risk Students
    atRiskStudents: [{
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      studentName: String,
      score: Number,
      attempts: Number,
      lastAttemptDate: Date,
      riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high']
      }
    }],
    
    // Top Performers
    topPerformers: [{
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      studentName: String,
      score: Number,
      completionTime: Number,
      attemptDate: Date
    }],
    
    // Cheating/Violation Statistics
    violationStats: {
      totalViolations: {
        type: Number,
        default: 0
      },
      flaggedAttempts: {
        type: Number,
        default: 0
      },
      violationTypes: {
        tabSwitch: { type: Number, default: 0 },
        multipleFaces: { type: Number, default: 0 },
        noFace: { type: Number, default: 0 },
        voiceDetected: { type: Number, default: 0 },
        suspiciousTyping: { type: Number, default: 0 }
      }
    },
    
    // Pass/Fail Statistics
    passRate: {
      type: Number,
      default: 0 // percentage
    },
    failRate: {
      type: Number,
      default: 0 // percentage
    },
    passingThreshold: {
      type: Number,
      default: 60 // percentage
    },
    
    // Comparison Data
    classAverage: {
      type: Number,
      default: 0
    },
    nationalAverage: {
      type: Number,
      default: 0
    },
    
    // Last Updated
    lastCalculated: {
      type: Date,
      default: Date.now
    }
  },
  { 
    timestamps: true
  }
);

// Method to calculate all analytics
quizAnalyticsSchema.methods.recalculate = async function() {
  const Result = mongoose.model('Result');
  const Question = mongoose.model('Question');

  const getStudentName = (user) => {
    if (!user) return 'Unknown Student';
    const first = user.firstName || '';
    const last = user.lastName || '';
    const combined = `${first} ${last}`.trim();
    return combined || user.username || user.email || 'Unknown Student';
  };

  const scorePercentFor = (result) => {
    if (Number.isFinite(result.score)) {
      return result.score;
    }
    const total = Number.isFinite(result.totalScore) && result.totalScore > 0 ? result.totalScore : 1;
    const earned = Number.isFinite(result.pointsEarned)
      ? result.pointsEarned
      : Number.isFinite(result.autoScore)
        ? result.autoScore
        : 0;
    return (earned / total) * 100;
  };

  // Get all completed results for this quiz
  const results = await Result.find({
    quiz: this.quiz,
    status: 'completed'
  }).populate('user', 'firstName lastName username email');
  
  if (results.length === 0) {
    return this;
  }
  
  // Basic statistics
  this.totalAttempts = results.length;
  this.completedAttempts = results.length;

  const scores = results.map(scorePercentFor);
  this.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  this.highestScore = Math.max(...scores);
  this.lowestScore = Math.min(...scores);
  
  // Median
  const sortedScores = [...scores].sort((a, b) => a - b);
  const mid = Math.floor(sortedScores.length / 2);
  this.medianScore = sortedScores.length % 2 !== 0 
    ? sortedScores[mid] 
    : (sortedScores[mid - 1] + sortedScores[mid]) / 2;
  
  // Standard deviation
  const mean = this.averageScore;
  const squareDiffs = scores.map(score => Math.pow(score - mean, 2));
  this.standardDeviation = Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / scores.length);
  
  // Time analytics
  const completionTimes = results.map(r => r.timeTaken).filter(t => t > 0);
  if (completionTimes.length > 0) {
    this.averageCompletionTime = completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length;
    this.fastestCompletion = Math.min(...completionTimes);
    this.slowestCompletion = Math.max(...completionTimes);
  }
  
  // Score distribution
  this.scoreDistribution = {
    '0-20': scores.filter(s => s <= 20).length,
    '21-40': scores.filter(s => s > 20 && s <= 40).length,
    '41-60': scores.filter(s => s > 40 && s <= 60).length,
    '61-80': scores.filter(s => s > 60 && s <= 80).length,
    '81-100': scores.filter(s => s > 80).length
  };
  
  // Grade distribution
  this.gradeDistribution = {
    'A': scores.filter(s => s >= 90).length,
    'B': scores.filter(s => s >= 80 && s < 90).length,
    'C': scores.filter(s => s >= 70 && s < 80).length,
    'D': scores.filter(s => s >= 60 && s < 70).length,
    'F': scores.filter(s => s < 60).length
  };
  
  // Pass/Fail
  const passed = scores.filter(s => s >= this.passingThreshold).length;
  this.passRate = (passed / scores.length) * 100;
  this.failRate = 100 - this.passRate;
  
  // Top performers (top 5)
  const resultsWithScores = results.map((resultDoc) => ({
    result: resultDoc,
    scorePercent: scorePercentFor(resultDoc)
  }));

  this.topPerformers = resultsWithScores
    .slice()
    .sort((a, b) => b.scorePercent - a.scorePercent)
    .slice(0, 5)
    .map(({ result: r, scorePercent }) => ({
      studentId: r.user?._id,
      studentName: getStudentName(r.user),
      score: scorePercent,
      completionTime: r.timeTaken,
      attemptDate: r.submittedAt
    }));

  // At-risk students (bottom 10%)
  const threshold = Math.max(1, Math.ceil(resultsWithScores.length * 0.1));
  this.atRiskStudents = resultsWithScores
    .slice()
    .sort((a, b) => a.scorePercent - b.scorePercent)
    .slice(0, threshold)
    .map(({ result: r, scorePercent }) => ({
      studentId: r.user?._id,
      studentName: getStudentName(r.user),
      score: scorePercent,
      attempts: 1,
      lastAttemptDate: r.submittedAt,
      riskLevel: scorePercent < 40 ? 'high' : scorePercent < 60 ? 'medium' : 'low'
    }));
  
  this.lastCalculated = new Date();
  
  return this;
};

module.exports = mongoose.model('QuizAnalytics', quizAnalyticsSchema);
