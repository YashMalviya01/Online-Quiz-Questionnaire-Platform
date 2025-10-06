const mongoose = require('mongoose');

const questionBankSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    
    // Organization
    category: {
      type: String,
      default: 'General',
      trim: true,
      index: true
    },
    subject: {
      type: String,
      trim: true,
      index: true
    },
    tags: {
      type: [String],
      default: [],
      index: true
    },
    
    // Questions
    questions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    }],
    
    // Statistics
    totalQuestions: {
      type: Number,
      default: 0
    },
    questionsByDifficulty: {
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 }
    },
    questionsByType: {
      'multiple-choice': { type: Number, default: 0 },
      'code': { type: Number, default: 0 },
      'fill-in-blank': { type: Number, default: 0 },
      'matching': { type: Number, default: 0 },
      'essay': { type: Number, default: 0 },
      'file-upload': { type: Number, default: 0 },
      'true-false': { type: Number, default: 0 }
    },
    
    // Sharing
    isPublic: {
      type: Boolean,
      default: false
    },
    sharedWith: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      permission: {
        type: String,
        enum: ['view', 'edit'],
        default: 'view'
      },
      sharedAt: {
        type: Date,
        default: Date.now
      }
    }],
    
    // Usage
    usageCount: {
      type: Number,
      default: 0
    },
    lastUsed: Date,
    
    // Import/Export
    importedFrom: String,
    exportFormat: {
      type: String,
      enum: ['json', 'csv', 'excel'],
      default: 'json'
    }
  },
  { 
    timestamps: true,
    indexes: [
      { owner: 1, name: 1 },
      { category: 1, subject: 1 },
      { tags: 1 }
    ]
  }
);

// Update statistics
questionBankSchema.methods.updateStatistics = async function() {
  const Question = mongoose.model('Question');
  
  const questions = await Question.find({ _id: { $in: this.questions } });
  
  this.totalQuestions = questions.length;
  
  // Count by difficulty
  this.questionsByDifficulty = {
    easy: questions.filter(q => q.difficulty === 'easy').length,
    medium: questions.filter(q => q.difficulty === 'medium').length,
    hard: questions.filter(q => q.difficulty === 'hard').length
  };
  
  // Count by type
  this.questionsByType = {
    'multiple-choice': questions.filter(q => q.questionType === 'multiple-choice').length,
    'code': questions.filter(q => q.questionType === 'code').length,
    'fill-in-blank': questions.filter(q => q.questionType === 'fill-in-blank').length,
    'matching': questions.filter(q => q.questionType === 'matching').length,
    'essay': questions.filter(q => q.questionType === 'essay').length,
    'file-upload': questions.filter(q => q.questionType === 'file-upload').length,
    'true-false': questions.filter(q => q.questionType === 'true-false').length
  };
  
  await this.save();
};

// Add question to bank
questionBankSchema.methods.addQuestion = async function(questionId) {
  if (!this.questions.includes(questionId)) {
    this.questions.push(questionId);
    await this.updateStatistics();
  }
  return this;
};

// Remove question from bank
questionBankSchema.methods.removeQuestion = async function(questionId) {
  this.questions = this.questions.filter(q => q.toString() !== questionId.toString());
  await this.updateStatistics();
  return this;
};

module.exports = mongoose.model('QuestionBank', questionBankSchema);
