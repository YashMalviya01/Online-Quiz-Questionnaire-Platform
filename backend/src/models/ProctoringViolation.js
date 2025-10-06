const mongoose = require('mongoose');

const proctoringViolationSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    attemptId: {
      type: String,
      required: true
    },
    violationType: {
      type: String,
      enum: [
        'no_face_detected',
        'multiple_faces',
        'eye_gaze_away',
        'head_rotation',
        'excessive_movement',
        'distance_change',
        'eyes_closed',
        'mouth_movement',
        'suspicious_expression',
        'abnormal_blink_rate',
        'tab_switched',
        'window_blur',
        'fullscreen_exited',
        'content_copied',
        'content_pasted',
        'right_click_attempted',
        'forbidden_shortcut_attempted',
        'background_audio_detected',
        'multiple_screens_detected',
        'virtual_machine_detected',
        // New liveness and audio detection types
        'liveness_check_failed',
        'liveness_suspicious',
        'multiple_speakers_detected',
        'whispering_detected',
        'suspicious_speech_pattern',
        'volume_fluctuation'
      ],
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    warningLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    adminNotified: {
      type: Boolean,
      default: false
    },
    adminNotifiedAt: {
      type: Date
    },
    studentWarned: {
      type: Boolean,
      default: false
    },
    studentWarnedAt: {
      type: Date
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    },
    actionTaken: {
      type: String,
      enum: ['none', 'warning_issued', 'disqualified', 'flagged_for_review', 'dismissed'],
      default: 'none'
    },
    adminNotes: {
      type: String
    }
  },
  { timestamps: true }
);

// Index for faster queries
proctoringViolationSchema.index({ quiz: 1, student: 1, timestamp: -1 });
proctoringViolationSchema.index({ attemptId: 1 });
proctoringViolationSchema.index({ adminNotified: 1, severity: 1 });

module.exports = mongoose.model('ProctoringViolation', proctoringViolationSchema);
