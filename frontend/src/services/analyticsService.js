import api from './api';

/**
 * Analytics Service
 * Handles all API calls related to quiz analytics
 */

/**
 * Get comprehensive quiz analytics
 */
export const getQuizAnalytics = async (quizId) => {
  try {
    const response = await api.get(`/analytics/quiz/${quizId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get question-level analytics
 */
export const getQuestionAnalytics = async (quizId) => {
  try {
    const response = await api.get(`/analytics/quiz/${quizId}/questions`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get at-risk students
 */
export const getAtRiskStudents = async (quizId) => {
  try {
    const response = await api.get(`/analytics/quiz/${quizId}/at-risk`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get top performers
 */
export const getTopPerformers = async (quizId) => {
  try {
    const response = await api.get(`/analytics/quiz/${quizId}/top-performers`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get performance trends
 */
export const getPerformanceTrends = async (quizId, startDate = null, endDate = null) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/analytics/quiz/${quizId}/trends?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get violation statistics
 */
export const getViolationStatistics = async (quizId) => {
  try {
    const response = await api.get(`/analytics/quiz/${quizId}/violations`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Export analytics report
 */
export const exportAnalyticsReport = async (quizId, format = 'json') => {
  try {
    const response = await api.get(`/analytics/quiz/${quizId}/export?format=${format}`, {
      responseType: format === 'csv' ? 'blob' : 'json'
    });
    
    if (format === 'csv') {
      // Create download link for CSV
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quiz-analytics-${quizId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return { success: true, message: 'Report downloaded' };
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Recalculate analytics
 */
export const recalculateAnalytics = async (quizId) => {
  try {
    const response = await api.post(`/analytics/quiz/${quizId}/recalculate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getQuizAnalytics,
  getQuestionAnalytics,
  getAtRiskStudents,
  getTopPerformers,
  getPerformanceTrends,
  getViolationStatistics,
  exportAnalyticsReport,
  recalculateAnalytics
};
