const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true
    },
    questionType: {
      type: String,
      enum: ['multiple-choice', 'code', 'fill-in-blank', 'matching', 'essay', 'file-upload', 'true-false'],
      default: 'multiple-choice'
    },
    
    // Question Bank Management
    category: {
      type: String,
      default: 'General',
      trim: true,
      index: true
    },
    tags: {
      type: [String],
      default: [],
      index: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
      index: true
    },
    isTemplate: {
      type: Boolean,
      default: false
    },
    templateName: {
      type: String,
      trim: true
    },
    
    // Multiple Choice
    options: {
      type: [String],
      default: undefined,
      validate: {
        validator(v) {
          if (this.questionType === 'multiple-choice') {
            return Array.isArray(v) && v.length >= 2 && v.every((option) => typeof option === 'string' && option.trim());
          }
          return !v || v.length === 0;
        },
        message: 'Multiple-choice questions must include at least two populated options.'
      }
    },
    correctAnswer: {
      type: String,
      default: '',
      trim: true,
      validate: {
        validator(value) {
          if (this.questionType === 'multiple-choice') {
            return typeof value === 'string' && value.trim().length > 0 && this.options.includes(value);
          }
          return true;
        },
        message: 'Correct answer must match one of the provided options.'
      }
    },
    
    // Fill in the Blank
    blankAnswers: {
      type: [String],
      default: []
    },
    caseSensitive: {
      type: Boolean,
      default: false
    },
    
    // Matching Questions
    matchingPairs: [{
      left: String,
      right: String
    }],
    
    // Essay Questions
    wordLimit: {
      type: Number,
      min: 0
    },
    rubric: {
      type: String,
      default: ''
    },
    sampleAnswer: {
      type: String,
      default: ''
    },
    
    // File Upload Questions
    allowedFileTypes: {
      type: [String],
      default: []
    },
    maxFileSize: {
      type: Number,
      default: 5 // MB
    },
    codeLanguage: {
      type: String,
      default: 'javascript',
      trim: true
    },
    starterCode: {
      type: String,
      default: ''
    },
    evaluationNotes: {
      type: String,
      default: ''
    },
    maxScore: {
      type: Number,
      default: 1,
      min: 0
    },
    partialCredit: {
      type: Boolean,
      default: false
    },
    referenceSolution: {
      type: String,
      default: ''
    },
    
    // Analytics
    timesUsed: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    averageTimeSpent: {
      type: Number,
      default: 0 // in seconds
    },
    
    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    usageCount: {
      type: Number,
      default: 0
    },
    
    // AI Generation Tracking
    aiGenerated: {
      isAIGenerated: {
        type: Boolean,
        default: false,
        index: true
      },
      aiSource: {
        type: String,
        enum: ['gemini-pro', 'gpt-4', 'gpt-3.5', 'claude', 'other', ''],
        default: ''
      },
      generationDate: {
        type: Date
      },
      topic: {
        type: String,
        trim: true
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
      },
      humanReviewed: {
        type: Boolean,
        default: false
      },
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reviewDate: {
        type: Date
      },
      reviewNotes: {
        type: String,
        default: ''
      },
      qualityScore: {
        type: Number,
        min: 0,
        max: 100
      },
      improvementSuggestions: {
        type: [String],
        default: []
      }
    }
  },
  { timestamps: true }
);

questionSchema.pre('validate', function ensureConsistentShape(next) {
  if (this.questionType === 'code') {
    this.options = undefined;
    this.correctAnswer = this.correctAnswer || '';
    this.codeLanguage = this.codeLanguage || 'javascript';
  } else {
    this.codeLanguage = '';
    this.starterCode = '';
    this.evaluationNotes = '';
    this.referenceSolution = '';
  }
  if (typeof this.maxScore !== 'number' || Number.isNaN(this.maxScore) || this.maxScore <= 0) {
    this.maxScore = 1;
  }
  next();
});

module.exports = mongoose.model('Question', questionSchema);
