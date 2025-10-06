import api from './api';

/**
 * Enhanced Proctoring Service
 * Handles all API calls related to enhanced proctoring
 */

/**
 * Create proctoring event
 */
export const createProctoringEvent = async (quizId, resultId) => {
  try {
    const response = await api.post('/enhanced-proctoring/events', {
      quizId,
      resultId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update proctoring event with violations
 */
export const updateProctoringEvent = async (eventId, violationData) => {
  try {
    const response = await api.put(`/enhanced-proctoring/events/${eventId}`, violationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get proctoring event by ID
 */
export const getProctoringEvent = async (eventId) => {
  try {
    const response = await api.get(`/enhanced-proctoring/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get proctoring events for a quiz
 */
export const getQuizProctoringEvents = async (quizId, filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.riskLevel) params.append('riskLevel', filters.riskLevel);
    if (filters.reviewStatus) params.append('reviewStatus', filters.reviewStatus);
    
    const response = await api.get(`/enhanced-proctoring/quiz/${quizId}/events?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Review proctoring event
 */
export const reviewProctoringEvent = async (eventId, reviewData) => {
  try {
    const response = await api.post(`/enhanced-proctoring/events/${eventId}/review`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get flagged attempts
 */
export const getFlaggedAttempts = async (quizId) => {
  try {
    const response = await api.get(`/enhanced-proctoring/quiz/${quizId}/flagged`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  createProctoringEvent,
  updateProctoringEvent,
  getProctoringEvent,
  getQuizProctoringEvents,
  reviewProctoringEvent,
  getFlaggedAttempts
};
