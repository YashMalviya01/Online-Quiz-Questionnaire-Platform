const mongoose = require('mongoose');

const proctoringEventSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Result',
      required: true
    },
    eventType: {
      type: String,
      required: true
    },
    eventData: {
      type: Object,
      default: {}
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true
    }
  },
  {
    timestamps: { createdAt: 'timestamp', updatedAt: false }
  }
);

module.exports = mongoose.model('ProctoringEvent', proctoringEventSchema);
