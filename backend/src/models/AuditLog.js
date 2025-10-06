const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    action: {
      type: String,
      required: true,
      enum: [
        'CREATE',
        'READ',
        'UPDATE',
        'DELETE',
        'LOGIN',
        'LOGOUT',
        'FAILED_LOGIN',
        'PASSWORD_CHANGE',
        'PERMISSION_CHANGE',
        'EXPORT',
        'IMPORT'
      ]
    },
    resource: {
      type: String,
      required: true,
      enum: ['User', 'Quiz', 'Question', 'Result', 'ProctoringEvent', 'System']
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId
    },
    changes: {
      type: Object,
      default: {}
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: { createdAt: 'timestamp', updatedAt: false }
  }
);

// Indexes for efficient querying
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1, action: 1 });
auditLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
