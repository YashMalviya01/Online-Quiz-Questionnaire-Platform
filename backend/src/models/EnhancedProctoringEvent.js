const mongoose = require('mongoose');

const enhancedProctoringEventSchema = new mongoose.Schema(
  {
    quizAttempt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Result',
      required: true,
      index: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true
    },
    
    // Eye Tracking
    eyeTracking: {
      lookAwayCount: {
        type: Number,
        default: 0
      },
      lookAwayDuration: {
        type: Number,
        default: 0 // in seconds
      },
      gazeDrift: {
        type: Number,
        default: 0 // percentage
      },
      eyeTrackingViolations: [{
        timestamp: Date,
        duration: Number,
        direction: String // 'left', 'right', 'up', 'down'
      }]
    },
    
    // Audio Monitoring
    audioMonitoring: {
      suspiciousSounds: [{
        timestamp: Date,
        soundType: String, // 'voice', 'typing', 'notification', 'other'
        confidence: Number, // 0-100
        audioClipUrl: String
      }],
      voiceDetectionCount: {
        type: Number,
        default: 0
      },
      multipleVoicesDetected: {
        type: Boolean,
        default: false
      }
    },
    
    // Screen Recording
    screenRecording: {
      recordingUrl: String,
      recordingStartTime: Date,
      recordingEndTime: Date,
      recordingDuration: Number, // in seconds
      screenshotUrls: [String],
      suspiciousScreenshots: [{
        timestamp: Date,
        screenshotUrl: String,
        reason: String
      }]
    },
    
    // Browser/Tab Monitoring
    browserMonitoring: {
      tabSwitches: [{
        timestamp: Date,
        duration: Number // time away in seconds
      }],
      totalTabSwitches: {
        type: Number,
        default: 0
      },
      appSwitches: [{
        timestamp: Date,
        appName: String,
        duration: Number
      }],
      totalAppSwitches: {
        type: Number,
        default: 0
      },
      copyPasteAttempts: [{
        timestamp: Date,
        action: String // 'copy' or 'paste'
      }],
      rightClickAttempts: [{
        timestamp: Date
      }]
    },
    
    // Keystroke Analysis
    keystrokeAnalysis: {
      typingSpeed: {
        type: Number,
        default: 0 // words per minute
      },
      typingPattern: {
        type: String,
        default: '' // encoded pattern
      },
      suspiciousTypingDetected: {
        type: Boolean,
        default: false
      },
      keystrokeViolations: [{
        timestamp: Date,
        reason: String,
        deviation: Number // percentage from normal
      }]
    },
    
    // Face Detection Advanced
    faceDetection: {
      multipleFacesDetected: [{
        timestamp: Date,
        faceCount: Number,
        screenshotUrl: String
      }],
      noFaceDetected: [{
        timestamp: Date,
        duration: Number
      }],
      differentPersonDetected: [{
        timestamp: Date,
        confidence: Number,
        screenshotUrl: String
      }],
      emotionAnalysis: [{
        timestamp: Date,
        emotion: String, // 'stressed', 'confused', 'focused', 'distracted'
        confidence: Number
      }]
    },
    
    // ID Verification
    idVerification: {
      idImageUrl: String,
      idType: String, // 'passport', 'drivers-license', 'student-id'
      verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'failed'],
        default: 'pending'
      },
      verifiedAt: Date,
      verificationNotes: String,
      faceMatchScore: Number // 0-100
    },
    
    // Network Analysis
    networkMonitoring: {
      ipAddress: String,
      ipChanges: [{
        timestamp: Date,
        oldIp: String,
        newIp: String
      }],
      vpnDetected: {
        type: Boolean,
        default: false
      },
      suspiciousNetworkActivity: [{
        timestamp: Date,
        activityType: String,
        details: String
      }]
    },
    
    // Overall Risk Assessment
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    },
    violationSummary: {
      total: {
        type: Number,
        default: 0
      },
      critical: {
        type: Number,
        default: 0
      },
      major: {
        type: Number,
        default: 0
      },
      minor: {
        type: Number,
        default: 0
      }
    },
    
    // Review Status
    reviewStatus: {
      type: String,
      enum: ['pending', 'under-review', 'cleared', 'flagged'],
      default: 'pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date,
    reviewNotes: String,
    
    // Actions Taken
    actionsTaken: [{
      timestamp: Date,
      action: String, // 'warning-sent', 'quiz-terminated', 'flagged-for-review'
      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      notes: String
    }]
  },
  { 
    timestamps: true,
    indexes: [
      { quiz: 1, student: 1 },
      { riskLevel: 1 },
      { reviewStatus: 1 }
    ]
  }
);

// Calculate risk score
enhancedProctoringEventSchema.methods.calculateRiskScore = function() {
  let score = 0;
  
  // Eye tracking violations
  score += this.eyeTracking.lookAwayCount * 2;
  score += Math.min(this.eyeTracking.lookAwayDuration / 60, 10); // max 10 points
  
  // Audio violations
  score += this.audioMonitoring.voiceDetectionCount * 5;
  if (this.audioMonitoring.multipleVoicesDetected) score += 20;
  
  // Browser violations
  score += this.browserMonitoring.totalTabSwitches * 3;
  score += this.browserMonitoring.totalAppSwitches * 5;
  score += this.browserMonitoring.copyPasteAttempts.length * 4;
  
  // Face detection violations
  score += this.faceDetection.multipleFacesDetected.length * 15;
  score += this.faceDetection.noFaceDetected.length * 10;
  score += this.faceDetection.differentPersonDetected.length * 25;
  
  // Keystroke violations
  if (this.keystrokeAnalysis.suspiciousTypingDetected) score += 15;
  
  // Network violations
  score += this.networkMonitoring.ipChanges.length * 10;
  if (this.networkMonitoring.vpnDetected) score += 5;
  
  // Cap at 100
  this.riskScore = Math.min(score, 100);
  
  // Set risk level
  if (this.riskScore >= 75) this.riskLevel = 'critical';
  else if (this.riskScore >= 50) this.riskLevel = 'high';
  else if (this.riskScore >= 25) this.riskLevel = 'medium';
  else this.riskLevel = 'low';
  
  return this.riskScore;
};

module.exports = mongoose.model('EnhancedProctoringEvent', enhancedProctoringEventSchema);
