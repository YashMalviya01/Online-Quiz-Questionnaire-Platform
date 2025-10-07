import api from './api';

/**
 * Grading Service
 * Handles all API calls related to grading
 */

/**
 * Get results needing grading
 */
export const getPendingGrading = async (quizId) => {
  try {
    const response = await api.get(`/grading/quiz/${quizId}/pending`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Grade a single answer
 */
export const gradeAnswer = async (resultId, questionId, gradingData) => {
  try {
    const response = await api.post(
      `/grading/result/${resultId}/answer/${questionId}`,
      gradingData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Grade with rubric
 */
export const gradeWithRubric = async (resultId, questionId, rubricScores, feedback) => {
  try {
    const response = await api.post(
      `/grading/result/${resultId}/answer/${questionId}/rubric`,
      { rubricScores, feedback }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Bulk grade multiple answers
 */
export const bulkGrade = async (resultId, gradings) => {
  try {
    const response = await api.post(`/grading/result/${resultId}/bulk`, {
      gradings
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Add instructor feedback
 */
export const addFeedback = async (resultId, feedback) => {
  try {
    const response = await api.post(`/grading/result/${resultId}/feedback`, {
      feedback
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get grading statistics
 */
export const getGradingStatistics = async (quizId) => {
  try {
    const response = await api.get(`/grading/quiz/${quizId}/statistics`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Auto-grade objective questions
 */
export const autoGrade = async (resultId) => {
  try {
    const response = await api.post(`/grading/result/${resultId}/auto-grade`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getPendingGrading,
  gradeAnswer,
  gradeWithRubric,
  bulkGrade,
  addFeedback,
  getGradingStatistics,
  autoGrade
};
