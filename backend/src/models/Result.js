const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    questionType: {
      type: String,
      enum: ['multiple-choice', 'code', 'fill-in-blank', 'matching', 'essay', 'file-upload', 'true-false'],
      default: 'multiple-choice'
    },
    selectedOption: {
      type: String,
      default: ''
    },
    codeAnswer: {
      type: String,
      default: ''
    },
    textAnswer: {
      type: String,
      default: ''
    },
    
    // Fill in the blank - multiple answers
    blankAnswers: {
      type: [String],
      default: []
    },
    
    // Matching - pairs
    matchingAnswers: {
      type: [
        {
          left: String,
          right: String
        }
      ],
      default: []
    },
    
    // Essay
    essayAnswer: {
      type: String,
      default: ''
    },
    wordCount: {
      type: Number,
      default: 0
    },
    
    // File upload
    uploadedFiles: {
      type: [
        {
          filename: String,
          fileUrl: String,
          fileSize: Number,
          fileType: String,
          uploadedAt: Date
        }
      ],
      default: []
    },
    
    // Scoring
    awardedScore: {
      type: Number,
      default: 0
    },
    maxScore: {
      type: Number,
      default: 1
    },
    isCorrect: {
      type: Boolean,
      default: false
    },
    
    // Manual grading (for essays, file uploads)
    needsGrading: {
      type: Boolean,
      default: false
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    gradedAt: Date,
    feedback: {
      type: String,
      default: ''
    },
    rubricScores: {
      type: Map,
      of: Number
    },
    
    // Time tracking
    timeSpent: {
      type: Number,
      default: 0 // in seconds
    },
    startedAt: Date,
    answeredAt: Date,
    
    // AI Detection for Code Answers
    aiDetection: {
      analyzed: {
        type: Boolean,
        default: false
      },
      aiScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      compositeScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      isAIGenerated: {
        type: Boolean,
        default: false
      },
      confidence: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      indicators: [{
        type: {
          type: String
        },
        severity: String,
        message: String
      }],
      recommendation: {
        type: String,
        default: ''
      },
      detailedAnalysis: {
        commentRatio: mongoose.Schema.Types.Mixed,
        variableNaming: mongoose.Schema.Types.Mixed,
        boilerplate: mongoose.Schema.Types.Mixed,
        gptFingerprints: mongoose.Schema.Types.Mixed
      },
      analyzedAt: {
        type: Date
      }
    }
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    score: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['in-progress', 'submitted', 'completed'],
      default: 'in-progress'
    },
    answers: {
      type: [answerSchema],
      default: []
    },
    autoScore: {
      type: Number,
      default: 0
    },
    autoMaxScore: {
      type: Number,
      default: 0
    },
    pointsEarned: {
      type: Number,
      default: 0
    },
    totalScore: {
      type: Number,
      default: 0
    },
    requiresManualReview: {
      type: Boolean,
      default: false
    },
    manuallyGraded: {
      type: Boolean,
      default: false
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    submittedAt: {
      type: Date
    },
    timeTaken: {
      type: Number,
      default: 0 // in seconds
    },
    proctoringLog: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProctoringEvent'
      }
    ],
    disqualified: {
      type: Boolean,
      default: false
    },
    disqualificationReason: {
      type: String
    },
    disqualifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    disqualifiedAt: {
      type: Date
    },
    
    // Enhanced Proctoring Reference
    enhancedProctoringEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EnhancedProctoringEvent'
    },
    
    // Feedback
    instructorFeedback: {
      type: String,
      default: ''
    },
    feedbackGivenAt: Date,
    feedbackGivenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

// Calculate total score
resultSchema.methods.calculateScore = function() {
  const earned = this.answers.reduce((sum, answer) => sum + (answer.awardedScore || 0), 0);
  const possible = this.answers.reduce((sum, answer) => sum + (answer.maxScore || 0), 0);

  this.pointsEarned = earned;
  this.totalScore = possible;
  this.autoScore = earned;
  this.autoMaxScore = possible;
  this.score = possible > 0 ? Math.round((earned / possible) * 100) : 0;

  return this.score;
};

// Check if needs manual grading
resultSchema.methods.checkNeedsManualGrading = function() {
  this.requiresManualReview = this.answers.some(answer => answer.needsGrading);
  return this.requiresManualReview;
};

module.exports = mongoose.model('Result', resultSchema);
