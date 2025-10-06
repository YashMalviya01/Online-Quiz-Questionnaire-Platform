const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    timeLimit: {
      type: Number, // Time limit in minutes
      default: null // null means no time limit
    },
    expiryDate: {
      type: Date, // Quiz expiry date
      default: null // null means no expiry
    },
    maxAttempts: {
      type: Number, // Maximum number of attempts allowed per student
      default: null // null means unlimited attempts
    },
    
    // Question Randomization
    randomizeQuestions: {
      type: Boolean,
      default: false
    },
    randomizeOptions: {
      type: Boolean,
      default: false
    },
    questionPool: {
      enabled: {
        type: Boolean,
        default: false
      },
      poolSize: {
        type: Number,
        default: 0 // Number of questions to randomly select from the pool
      },
      poolQuestions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
      }]
    },
    
    // Adaptive Testing
    isAdaptive: {
      type: Boolean,
      default: false
    },
    adaptiveSettings: {
      startingDifficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
      },
      adjustmentThreshold: {
        type: Number,
        default: 0.7 // Percentage correct to increase difficulty
      },
      minQuestions: {
        type: Number,
        default: 10
      },
      maxQuestions: {
        type: Number,
        default: 50
      },
      terminationThreshold: {
        type: Number,
        default: 0.95 // Confidence level to terminate quiz
      }
    },
    
    // Grading Settings
    gradingSettings: {
      passingScore: {
        type: Number,
        default: 60 // Percentage
      },
      allowPartialCredit: {
        type: Boolean,
        default: false
      },
      gradeCurve: {
        enabled: {
          type: Boolean,
          default: false
        },
        curveType: {
          type: String,
          enum: ['linear', 'bell-curve', 'custom'],
          default: 'linear'
        }
      },
      autoReleaseGrades: {
        type: Boolean,
        default: true
      },
      showCorrectAnswers: {
        type: Boolean,
        default: false
      },
      showFeedback: {
        type: Boolean,
        default: true
      }
    },
    
    // Enhanced Proctoring Settings
    proctoringSettings: {
      enableEyeTracking: {
        type: Boolean,
        default: false
      },
      enableAudioMonitoring: {
        type: Boolean,
        default: false
      },
      enableScreenRecording: {
        type: Boolean,
        default: false
      },
      enableKeystrokeAnalysis: {
        type: Boolean,
        default: false
      },
      requireIDVerification: {
        type: Boolean,
        default: false
      },
      browserLockdown: {
        type: Boolean,
        default: false
      },
      allowedIPAddresses: {
        type: [String],
        default: []
      },
      blockVPN: {
        type: Boolean,
        default: false
      }
    },
    
    // Question Bank
    questionBank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuestionBank'
    },
    
    // Analytics
    analyticsEnabled: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Method to get random questions from pool
quizSchema.methods.getRandomQuestions = function() {
  if (!this.questionPool.enabled) {
    return this.questions;
  }
  
  const poolSize = Math.min(this.questionPool.poolSize, this.questionPool.poolQuestions.length);
  const shuffled = [...this.questionPool.poolQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, poolSize);
};

// Method to get next adaptive question
quizSchema.methods.getNextAdaptiveQuestion = async function(currentDifficulty, performanceScore) {
  const Question = mongoose.model('Question');
  
  let nextDifficulty = currentDifficulty;
  
  if (performanceScore >= this.adaptiveSettings.adjustmentThreshold) {
    // Increase difficulty
    if (currentDifficulty === 'easy') nextDifficulty = 'medium';
    else if (currentDifficulty === 'medium') nextDifficulty = 'hard';
  } else if (performanceScore < 0.5) {
    // Decrease difficulty
    if (currentDifficulty === 'hard') nextDifficulty = 'medium';
    else if (currentDifficulty === 'medium') nextDifficulty = 'easy';
  }
  
  // Find a random question of the appropriate difficulty
  const availableQuestions = await Question.find({
    _id: { $in: this.questions },
    difficulty: nextDifficulty
  });
  
  if (availableQuestions.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  return availableQuestions[randomIndex];
};

module.exports = mongoose.model('Quiz', quizSchema);
