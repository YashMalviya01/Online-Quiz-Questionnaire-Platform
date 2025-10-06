const AuditLog = require('../models/AuditLog');
const { logger } = require('../utils/advancedLogger');

/**
 * Log audit trail
 */
const logAudit = async (userId, action, resource, resourceId = null, changes = {}, metadata = {}, req = null) => {
  try {
    const auditData = {
      userId,
      action,
      resource,
      resourceId,
      changes,
      metadata
    };

    if (req) {
      auditData.ipAddress = req.ip || req.connection?.remoteAddress;
      auditData.userAgent = req.get('user-agent');
    }

    await AuditLog.create(auditData);
    
    logger.info('Audit log created', { userId, action, resource, resourceId });
  } catch (error) {
    logger.error('Failed to create audit log', { error: error.message, userId, action, resource });
  }
};

/**
 * Middleware to automatically log certain actions
 */
const auditMiddleware = (action, resource) => {
  return async (req, res, next) => {
    // Store original send function
    const originalSend = res.send;

    // Override send function to log after successful request
    res.send = function (data) {
      // Only log successful requests (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const userId = req.user?._id;
        const resourceId = req.params?.id || req.body?._id;
        
        if (userId) {
          logAudit(
            userId,
            action,
            resource,
            resourceId,
            {},
            { method: req.method, url: req.originalUrl },
            req
          ).catch(err => logger.error('Audit middleware error', { error: err.message }));
        }
      }

      // Call original send
      return originalSend.call(this, data);
    };

    next();
  };
};

/**
 * Get audit logs for a user
 */
const getUserAuditLogs = async (userId, options = {}) => {
  const { limit = 50, skip = 0, action, resource } = options;

  const query = { userId };
  if (action) query.action = action;
  if (resource) query.resource = resource;

  return await AuditLog.find(query)
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
};

/**
 * Get audit logs for a resource
 */
const getResourceAuditLogs = async (resource, resourceId, options = {}) => {
  const { limit = 50, skip = 0 } = options;

  return await AuditLog.find({ resource, resourceId })
    .populate('userId', 'username email')
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
};

/**
 * Get recent audit logs (admin)
 */
const getRecentAuditLogs = async (options = {}) => {
  const { limit = 100, skip = 0, action, resource } = options;

  const query = {};
  if (action) query.action = action;
  if (resource) query.resource = resource;

  return await AuditLog.find(query)
    .populate('userId', 'username email role')
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
};

module.exports = {
  logAudit,
  auditMiddleware,
  getUserAuditLogs,
  getResourceAuditLogs,
  getRecentAuditLogs
};
